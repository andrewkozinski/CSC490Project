from fastapi import APIRouter, HTTPException
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache
from database import watchlist
from routes.auth import verify_jwt_token, get_user_id_from_token
from routes import books, tvshows, movies
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
    return {"message": "Bookmark removed successfully"}

@router.get("/is_bookmarked/media_type/{media_type}/media_id/{media_id}")
async def is_bookmarked(media_type:str, media_id:str, user_id: int):
    result = watchlist.is_bookmarked(user_id, media_id, media_type)
    return {"is_bookmarked": result}

@router.get("/all_bookmarks/user/{user_id}")
async def get_user_bookmarks(user_id: int, limit: int = 3):
    bookmarks = watchlist.get_user_watchlist(user_id, limit)
    if bookmarks is not None:

        #Get some information about each bookmark

        for bookmark in bookmarks:
            if bookmark['media_type'] == 'book':
                bookmark['media_type'] = "books"
                book_info = await books.get_book_details(bookmark['media_id'])
                bookmark['info'] = book_info
            elif bookmark['media_type'] == 'tvshow':
                tvshow_info = await tvshows.get_tvshow(bookmark['media_id'])
                bookmark['info'] = tvshow_info
            elif bookmark['media_type'] == 'movie':
                bookmark['media_type'] = "movies"
                movie_info = await movies.get_movie(bookmark['media_id'])
                bookmark['info'] = movie_info
            else:
                bookmark['info'] = None

        return {"bookmarks": bookmarks}
    else:
        return {"bookmarks": []}