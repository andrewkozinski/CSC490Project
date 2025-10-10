from fastapi import APIRouter
from routes.books import search_books
from routes.tvshows import search_tvshows
from routes.movies import search_movies
router = APIRouter()



@router.get("/search/all")
async def search_all(query: str, page: int = 1):
    return {
        "message": "Success"
    }