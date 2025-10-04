from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv
from models.tvshow import TvShow

router = APIRouter()
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

#genre id helper function for TV Shows as some extra mappings exist
GENRE_ID_TO_NAME = {
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap"
}

@router.get("/search")
async def search_tvshows(query: str, page: int = 1):
    url = f"https://api.themoviedb.org/3/search/tv?api_key={TMDB_API_KEY}&query={query}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()


        """tv show model
            id: str
            title: str
            director: str
            release_date: str
            seasons: int
            episodes: int
            img: str
        """
        tv_shows = []
        for item in data.get('results', []):

            #Grab more detailed information for each tv show
            #to get number of seasons and episodes
            detail_url = f"https://api.themoviedb.org/3/tv/{item['id']}?api_key={TMDB_API_KEY}"
            detail_response = await client.get(detail_url)
            detail_response.raise_for_status()
            detail_item = detail_response.json()
            #get created_by from detail_item as a list of strings
            created_by=[creator['name'] for creator in detail_item.get('created_by', [])]

            tv_show = TvShow(
                id=str(item['id']),
                title=item['name'],
                genre=[GENRE_ID_TO_NAME.get(genre_id, "Unknown") for genre_id in item.get('genre_ids', [])], #map genre ids to names
                created_by=created_by or ["N/A"],
                release_date=item.get('first_air_date', "N/A"),
                seasons=detail_item.get('number_of_seasons', 0),
                episodes=detail_item.get('number_of_episodes', 0),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else "",
                description = item.get('overview', "No overview available.")
            )
            tv_shows.append(tv_show)

        return {
            "page": data.get('page', 1),
            "total_results": data.get('total_results', 0),
            "total_pages": data.get('total_pages', 1),
            "results": tv_shows
        }

@router.get("/search/detailed")
async def search_tvshows_detailed(query: str, page: int = 1):
    url = f"https://api.themoviedb.org/3/search/tv?api_key={TMDB_API_KEY}&query={query}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

#Search by genre
@router.get("/search/genre/{genre_name}")
async def search_tvshows_by_genre(genre_name: str, page: int = 1):
    # Find the genre ID from the name
    genre_id = next((id for id, name in GENRE_ID_TO_NAME.items()
                    if name.lower() == genre_name.lower()), None)
    if genre_id is None:
        raise HTTPException(status_code=400, detail="Invalid genre name")
    url = f"https://api.themoviedb.org/3/discover/tv?api_key={TMDB_API_KEY}&with_genres={genre_id}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        tv_shows = []
        for item in data.get('results', []):

            #Grab more detailed information for each tv show
            #to get number of seasons and episodes
            detail_url = f"https://api.themoviedb.org/3/tv/{item['id']}?api_key={TMDB_API_KEY}"
            detail_response = await client.get(detail_url)
            detail_response.raise_for_status()
            detail_item = detail_response.json()
            #get created_by from detail_item as a list of strings
            created_by=[creator['name'] for creator in detail_item.get('created_by', [])]

            tv_show = TvShow(
                id=str(item['id']),
                title=item['name'],
                genre=[GENRE_ID_TO_NAME.get(genre_id, "Unknown") for genre_id in item.get('genre_ids', [])], #map genre ids to names
                created_by=created_by or ["N/A"],
                release_date=item.get('first_air_date', "N/A"),
                seasons=detail_item.get('number_of_seasons', 0),
                episodes=detail_item.get('number_of_episodes', 0),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else "",
                description=item.get('overview', "No overview available.")
            )
            tv_shows.append(tv_show)

        return {
            "page": data.get('page', 1),
            "total_results": data.get('total_results', 0),
            "total_pages": data.get('total_pages', 1),
            "results": tv_shows
        }

@router.get("/search/trending")
async def get_trending_tvshows(page: int = 1):
    url = f"https://api.themoviedb.org/3/trending/tv/week?api_key={TMDB_API_KEY}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        tv_shows = []
        for item in data.get('results', []):

            #Grab more detailed information for each tv show
            #to get number of seasons and episodes
            detail_url = f"https://api.themoviedb.org/3/tv/{item['id']}?api_key={TMDB_API_KEY}"
            detail_response = await client.get(detail_url)
            detail_response.raise_for_status()
            detail_item = detail_response.json()
            #get created_by from detail_item as a list of strings
            created_by=[creator['name'] for creator in detail_item.get('created_by', [])]

            tv_show = TvShow(
                id=str(item['id']),
                title=item['name'],
                genre=[GENRE_ID_TO_NAME.get(genre_id, "Unknown") for genre_id in item.get('genre_ids', [])], #map genre ids to names
                created_by=created_by or ["N/A"],
                release_date=item.get('first_air_date', "N/A"),
                seasons=detail_item.get('number_of_seasons', 0),
                episodes=detail_item.get('number_of_episodes', 0),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else "",
                description=item.get('overview', "No overview available.")
            )
            tv_shows.append(tv_show)

        return {
            "page": data.get('page', 1),
            "total_results": data.get('total_results', 0),
            "total_pages": data.get('total_pages', 1),
            "results": tv_shows
        }

@router.get("/{tv_id}", response_model=TvShow)
async def get_tvshow(tv_id: int):
    url = f"https://api.themoviedb.org/3/tv/{tv_id}?api_key={TMDB_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="TV show not found")
        response.raise_for_status()
        item = response.json()

        created_by = [creator['name'] for creator in item.get('created_by', [])]

        #Note: the API sometimes has its genre as an empty array, so not every response has a genre
        tv_show = TvShow(
            id=str(item['id']),
            title=item['name'],
            genre=[genre['name'] for genre in item.get('genres', [])],
            created_by=created_by or ["N/A"],
            release_date=item.get('first_air_date', "N/A"),
            seasons=item.get('number_of_seasons', 0),
            episodes=item.get('number_of_episodes', 0),
            img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else "",
            description = item.get('overview', "No overview available.")
        )
        return tv_show

@router.get("/detailed/{tv_id}")
async def get_tvshow_detailed(tv_id: int):
    url = f"https://api.themoviedb.org/3/tv/{tv_id}?api_key={TMDB_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="TV show not found")
        response.raise_for_status()
        return response.json()