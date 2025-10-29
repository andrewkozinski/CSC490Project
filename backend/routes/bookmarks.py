from fastapi import APIRouter, HTTPException
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache
from database import watchlist

router = APIRouter()

async def user_key_builder(func, namespace, request, *args, **kwargs):
    user_id = kwargs.get("user_id")
    print(user_id)
    print(namespace)
    if user_id is None:
        for a in args:
            if isinstance(a, int):
                user_id = a
                break
    return f"{namespace}_user_{user_id}"

@router.get("/all")
async def get_all_bookmarks():
    # Placeholder implementation
    return {"bookmarks": []}

@router.post("/add/{list_id}")
async def add_bookmark(media_type: str, media_id: str, jwt_token: str):
    # Placeholder implementation
    return {"message": "Bookmark added successfully"}

@router.delete("/remove/{list_id}")
async def remove_bookmark(media_type: str, media_id: str, jwt_token: str):
    # Placeholder implementation
    return {"message": "Bookmark removed successfully"}

@router.get("/is_bookmarked/{list_id}")
async def is_bookmarked(media_type:str, media_id:str, user_id: int):
    # Placeholder implementation
    return {"is_bookmarked": False}

@router.get("/all_bookmarks/user/{user_id}")
@cache(namespace="recent_reviews_user_{user_id}", expire=300)
async def get_user_bookmarks(user_id: int, limit: int = 3):
    bookmarks = watchlist.get_user_watchlist(user_id, limit)
    if bookmarks is not None:
        return {"bookmarks": bookmarks}
    else:
        return {"bookmarks": []}