from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv
from models.movie import Movie

router = APIRouter()

load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

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
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

@router.get("/{movie_id}", response_model=Movie)
async def get_movie(movie_id: int):

    async with httpx.AsyncClient() as client:

        get_movie_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}"
        movie_response = await client.get(get_movie_url)

        if movie_response.status_code != 200:
            raise HTTPException(status_code=movie_response.status_code, detail="Movie not found")

        movie_details = movie_response.json()

        credits_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={TMDB_API_KEY}"
        credits_response = await client.get(credits_url)

        if credits_response.status_code != 200:
            raise HTTPException(status_code=credits_response.status_code, detail="Credits not found")

        credits_details = credits_response.json()

        #Get the director from the crew list
        director = next((member for member in credits_details['crew'] if member['job'] == 'Director'), None)

        movie = Movie(
            id=str(movie_details['id']),
            title=movie_details['title'],
            director=director['name'] if director else "Unknown",
            year=movie_details['release_date'].split('-')[0] if movie_details.get('release_date') else "Unknown",
            release_date=movie_details.get('release_date', "N/A")
        )

        return movie
