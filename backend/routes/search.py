from fastapi import APIRouter
from routes.books import search_books, get_books_by_genre
from routes.tvshows import search_tvshows, search_tvshows_by_genre
from routes.movies import search_movies, search_movies_by_genre
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


@router.get("/search/all/genre")
async def search_all_by_genre(genre: str, page: int = 1):
    # Search books, tv shows, and movies by genre concurrently
    books_task = get_books_by_genre(genre, page)
    tvshows_task = search_tvshows_by_genre(genre, page)
    movies_task = search_movies_by_genre(genre, page)

    books_result, tvshows_result, movies_result = await books_task, await tvshows_task, await movies_task

    # Combine results
    combined_results = {
        "books": books_result,
        "tv_shows": tvshows_result,
        "movies": movies_result
    }

    return combined_results