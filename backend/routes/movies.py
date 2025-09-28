from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv
from models.movie import Movie

router = APIRouter()

load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# A movie response has a genre id list, we need to map those ids to genre names
# Usually, to grab this information you'd need the following:
# "https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}"
GENRE_ID_TO_NAME = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
}

GENRE_NAME_TO_ID = {
    "Action": 28,
    "Adventure": 12,
    "Animation": 16,
    "Comedy": 35,
    "Crime": 80,
    "Documentary": 99,
    "Drama": 18,
    "Family": 10751,
    "Fantasy": 14,
    "History": 36,
    "Music": 10402,
    "Mystery": 9648,
    "Romance": 10749,
    "Science Fiction": 878,
    "TV Movie": 10770,
    "Thriller": 53,
    "War": 10752,
    "Western": 37
}

#Returns movie information in the Movie model format
@router.get("/search")
async def search_movies(query: str, page: int = 1):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        movies = []
        for item in data.get('results', []):

            #Get director information from the movie details endpoint
            credits_url = f"https://api.themoviedb.org/3/movie/{item['id']}/credits?api_key={TMDB_API_KEY}"
            credits_response = await client.get(credits_url)
            if credits_response.status_code != 200:
                continue  # Skip if we can't get credits
            credits_details = credits_response.json()
            director = next((member for member in credits_details['crew'] if member['job'] == 'Director'), None)

            movie = Movie(
                id=str(item['id']),
                title=item['title'],
                genre=[GENRE_ID_TO_NAME.get(genre_id, "Unknown") for genre_id in item.get('genre_ids', [])],
                director=director['name'] if director else "Unknown",
                year=item['release_date'].split('-')[0] if item.get('release_date') else "Unknown",
                release_date=item.get('release_date', "N/A"),
                overview=item.get('overview', "No overview available."),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else ""
            )
            movies.append(movie)

        return {
            "page": data.get('page', 1),
            "total_results": data.get('total_results', 0),
            "total_pages": data.get('total_pages', 1),
            "results": movies
        }

# Detailed search that returns the full JSON response from TMDB
@router.get("/search/detailed")
async def search_movies_detailed(query: str, page: int = 1):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

#Search by genre
@router.get("/search/genre/{genre_name}")
async def search_movies_by_genre(genre_name: str, page: int = 1):
    # Find the genre ID from the name
    genre_id = next((id for id, name in GENRE_ID_TO_NAME.items()
                    if name.lower() == genre_name.lower()), None)
    if genre_id is None:
        raise HTTPException(status_code=400, detail="Invalid genre name")
    url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_genres={genre_id}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()


        movies = []
        for item in data.get('results', []):

            #Get director information from the movie details endpoint
            credits_url = f"https://api.themoviedb.org/3/movie/{item['id']}/credits?api_key={TMDB_API_KEY}"
            credits_response = await client.get(credits_url)
            if credits_response.status_code != 200:
                continue  # Skip if we can't get credits
            credits_details = credits_response.json()
            director = next((member for member in credits_details['crew'] if member['job'] == 'Director'), None)

            movie = Movie(
                id=str(item['id']),
                title=item['title'],
                genre=[GENRE_ID_TO_NAME.get(genre_id, "Unknown") for genre_id in item.get('genre_ids', [])],
                director=director['name'] if director else "Unknown",
                year=item['release_date'].split('-')[0] if item.get('release_date') else "Unknown",
                release_date=item.get('release_date', "N/A"),
                overview=item.get('overview', "No overview available."),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else ""
            )
            movies.append(movie)

        return {
            "page": data.get('page', 1),
            "total_results": data.get('total_results', 0),
            "total_pages": data.get('total_pages', 1),
            "results": movies
        }

@router.get("/{movie_id}", response_model=Movie)
async def get_movie(movie_id: int):

    async with httpx.AsyncClient() as client:

        get_movie_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}"
        movie_response = await client.get(get_movie_url)

        if movie_response.status_code != 200:
            raise HTTPException(status_code=movie_response.status_code, detail="Movie not found")

        movie_details = movie_response.json()
        # genre in details response is contained like this:
        # "genres": [
        # {
        #    "id": 18,
        #    "name": "Drama"
        # }
        # ],

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
            genre=[genre['name'] for genre in movie_details.get('genres', [])],
            director=director['name'] if director else "Unknown",
            year=movie_details['release_date'].split('-')[0] if movie_details.get('release_date') else "Unknown",
            release_date=movie_details.get('release_date', "N/A"),
            overview=movie_details.get('overview', "No overview available."),
            img = "https://image.tmdb.org/t/p/w500" + movie_details['poster_path'] if movie_details.get('poster_path') else ""
        )

        return movie
