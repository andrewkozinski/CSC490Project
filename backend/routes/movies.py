from fastapi import APIRouter
import requests
router = APIRouter()

TMDB_API_KEY = "key here"

# Dictionary to simulate a database or API fetching movies
movies = {
        1: {"name": "Spiderverse 3", "director": "Never Coming Out", "year": 2099},
        2: {"name": "CSC 343: David Gerstl's Wild Ride", "director": "David Gerstl", "year": 2025},
        3: {"name": "Superman 2", "director": "James Gunn", "year": 2027}
    }

@router.get("/all")
async def get_all_movies():
    return movies


@router.get("/search")
async def search_movies(query: str, page: int = 1):
