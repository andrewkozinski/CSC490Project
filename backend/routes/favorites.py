from fastapi import APIRouter, HTTPException
#from fastapi_cache import FastAPICache
#from fastapi_cache.decorator import cache
from database import favorites
from routes.auth import verify_jwt_token, get_user_id_from_token
from routes import books, tvshows, movies
from aiocache import cached, Cache, caches

router = APIRouter()

@router.post("/add/media_type/{media_type}/media_id/{media_id}")
async def add_favorite(media_type: str, media_id: str, jwt_token: str):
    #Verify the jwt token
    verify_jwt_token(jwt_token)

    #get user id
    user_id = get_user_id_from_token(jwt_token)

    result = favorites.add_favorites(user_id=user_id, media_id=media_id, media_type=media_type)
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to add bookmark")

    #Invalidate caches here
    await caches.get("user_favorites").delete(f"user_favorites_{user_id}")
    await caches.get("is_favorited").delete(f"is_favorited_{user_id}_{media_type}_{media_id}")
    return {"message": "Favorite added successfully"}

@router.delete("/remove/media_type/{media_type}/media_id/{media_id}")
async def remove_favorite(media_type: str, media_id: str, jwt_token: str):
    #Verify the jwt token
    verify_jwt_token(jwt_token)

    #get user id
    user_id = get_user_id_from_token(jwt_token)

    result = favorites.delete_by_media_id_and_type(user_id=user_id, media_id=media_id, media_type=media_type)
    if result is False:
        raise HTTPException(status_code=500, detail="Failed to remove favorite")

    #Invalidate caches here
    await caches.get("user_favorites").delete(f"user_favorites_{user_id}")
    await caches.get("is_favorited").delete(f"is_favorited_{user_id}_{media_type}_{media_id}")

    return {"message": "Favorite removed successfully"}

@router.get("/is_favorited/media_type/{media_type}/media_id/{media_id}")
@cached(ttl=3600, cache=Cache.MEMORY, alias="is_favorited", key_builder=lambda f, *args, **kwargs: f"is_favorited_{kwargs['user_id']}_{kwargs['media_type']}_{kwargs['media_id']}")
async def is_favorited(media_type:str, media_id:str, user_id: int):
    print("Checking if bookmarked...")
    result = favorites.is_favorited(user_id, media_id, media_type)
    return {"is_favorited": result}

@router.get("/all_favorites/user/{user_id}")
@cached(ttl=300, cache=Cache.MEMORY, alias="user_favorites", key_builder=lambda f, *args, **kwargs: f"user_favorites_{kwargs['user_id']}")
async def get_user_favorites(user_id: int, limit: int = 3):
    favorite_list = favorites.get_user_favorites(user_id, limit)
    if favorite_list is not None:

        #Get some information about each bookmark

        for favorite in favorite_list:
            try:
                if favorite['media_type'] == 'book':
                    favorite['media_type'] = "books"
                    favorite['media_id'] = favorites.get_string_id_from_int(favorite['media_id'])
                    book_info = await books.get_book_details(favorite['media_id'])
                    favorite['info'] = book_info
                    favorite['title'] = book_info.title
                    favorite['img'] = book_info.thumbnailUrl
                elif favorite['media_type'] == 'tvshow':
                    tvshow_info = await tvshows.get_tvshow(favorite['media_id'])
                    favorite['info'] = tvshow_info
                    favorite['title'] = tvshow_info.title
                    favorite['img'] = tvshow_info.img
                    favorite['media_type'] = "tv"
                elif favorite['media_type'] == 'movie':
                    favorite['media_type'] = "movies"
                    movie_info = await movies.get_movie(favorite['media_id'])
                    favorite['info'] = movie_info
                    favorite['title'] = movie_info.title
                    favorite['img'] = movie_info.img
                else:
                    favorite['info'] = None
            except Exception as e:
                print(f"Error fetching info for favorite {favorite['media_type']} {favorite['media_id']}: {str(e)}")
                favorite['info'] = "Error fetching info"
                favorite['title'] = "N/A"
                favorite['img'] = "https://placehold.co/100x150?text=Error"

        return {"favorites": favorite_list}
    else:
        return {"favorites": []}