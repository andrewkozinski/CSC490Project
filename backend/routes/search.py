from fastapi import APIRouter
from routes.books import search_books
from routes.tvshows import search_tvshows
from routes.movies import search_movies
router = APIRouter()



@router.get("/search/all")
async def search_all(query: str, page: int = 1):
    # Search books, tv shows, and movies concurrently
    books_task = search_books(query, page)
    tvshows_task = search_tvshows(query, page)
    movies_task = search_movies(query, page)

    books_result, tvshows_result, movies_result = await books_task, await tvshows_task, await movies_task

    # Combine results
    combined_results = {
        "books": books_result,
        "tv_shows": tvshows_result,
        "movies": movies_result
    }

    return combined_results