from fastapi import APIRouter, HTTPException
#from fastapi_cache import FastAPICache
#from fastapi_cache.decorator import cache
from database import watchlist
from routes.auth import verify_jwt_token, get_user_id_from_token
from routes import books, tvshows, movies
from aiocache import cached, Cache, caches

router = APIRouter()

@router.get("/all")
async def get_all_bookmarks():
    bookmarks = watchlist.get_all_bookmarks()
    if bookmarks is not None:
        return {"bookmarks": bookmarks}
    else:
        return {"bookmarks": []}

@router.post("/add/media_type/{media_type}/media_id/{media_id}")
async def add_bookmark(media_type: str, media_id: str, jwt_token: str):
    #Verify the jwt token
    verify_jwt_token(jwt_token)

    #get user id
    user_id = get_user_id_from_token(jwt_token)

    result = watchlist.add_watchlist(user_id=user_id, media_id=media_id, media_type=media_type)
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to add bookmark")

    #Invalidate caches here
    await caches.get("user_bookmarks").delete(f"user_bookmarks_{user_id}")
    await caches.get("is_bookmarked").delete(f"is_bookmarked_{user_id}_{media_type}_{media_id}")
    return {"message": "Bookmark added successfully"}

@router.delete("/remove/media_type/{media_type}/media_id/{media_id}")
async def remove_bookmark(media_type: str, media_id: str, jwt_token: str):
    #Verify the jwt token
    verify_jwt_token(jwt_token)

    #get user id
    user_id = get_user_id_from_token(jwt_token)

    result = watchlist.delete_by_media_id_and_type(user_id=user_id, media_id=media_id, media_type=media_type)
    if result is False:
        raise HTTPException(status_code=500, detail="Failed to remove bookmark")

    #Invalidate caches here
    await caches.get("user_bookmarks").delete(f"user_bookmarks_{user_id}")
    await caches.get("is_bookmarked").delete(f"is_bookmarked_{user_id}_{media_type}_{media_id}")

    return {"message": "Bookmark removed successfully"}

@router.get("/is_bookmarked/media_type/{media_type}/media_id/{media_id}")
@cached(ttl=3600, cache=Cache.MEMORY, alias="is_bookmarked", key_builder=lambda f, *args, **kwargs: f"is_bookmarked_{kwargs['user_id']}_{kwargs['media_type']}_{kwargs['media_id']}")
async def is_bookmarked(media_type:str, media_id:str, user_id: int):
    print("Checking if bookmarked...")
    result = watchlist.is_bookmarked(user_id, media_id, media_type)
    return {"is_bookmarked": result}

@router.get("/all_bookmarks/user/{user_id}")
@cached(ttl=300, cache=Cache.MEMORY, alias="user_bookmarks", key_builder=lambda f, *args, **kwargs: f"user_bookmarks_{kwargs['user_id']}")
async def get_user_bookmarks(user_id: int, limit: int = 3):
    bookmarks = watchlist.get_user_watchlist(user_id, limit)
    if bookmarks is not None:

        #Get some information about each bookmark

        for bookmark in bookmarks:
            if bookmark['media_type'] == 'book':
                bookmark['media_type'] = "books"
                book_info = await books.get_book_details(bookmark['media_id'])
                bookmark['info'] = book_info
                bookmark['title'] = book_info.title
                bookmark['img'] = book_info.thumbnailUrl
            elif bookmark['media_type'] == 'tvshow':
                tvshow_info = await tvshows.get_tvshow(bookmark['media_id'])
                bookmark['info'] = tvshow_info
                bookmark['title'] = tvshow_info.title
                bookmark['img'] = tvshow_info.img
                bookmark['media_type'] = "tv"
            elif bookmark['media_type'] == 'movie':
                bookmark['media_type'] = "movies"
                movie_info = await movies.get_movie(bookmark['media_id'])
                bookmark['info'] = movie_info
                bookmark['title'] = movie_info.title
                bookmark['img'] = movie_info.img
            else:
                bookmark['info'] = None

        return {"bookmarks": bookmarks}
    else:
        return {"bookmarks": []}