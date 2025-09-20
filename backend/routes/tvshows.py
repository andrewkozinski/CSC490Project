from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv
from models.tvshow import TvShow

router = APIRouter()
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

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
            tv_show = TvShow(
                id=str(item['id']),
                title=item['name'],
                director="N/A", #Temporarily N/A
                release_date=item.get('first_air_date', "N/A"),
                seasons=item.get('number_of_seasons', 0),
                episodes=item.get('number_of_episodes', 0),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else ""
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


@router.get("/{tv_id}", response_model=TvShow)
async def get_tvshow(tv_id: int):
    url = f"https://api.themoviedb.org/3/tv/{tv_id}?api_key={TMDB_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="TV show not found")
        response.raise_for_status()
        item = response.json()

        tv_show = TvShow(
            id=str(item['id']),
            title=item['name'],
            director="N/A",  # Director info is not typically available for TV shows in TMDB
            release_date=item.get('first_air_date', "N/A"),
            seasons=item.get('number_of_seasons', 0),
            episodes=item.get('number_of_episodes', 0),
            img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else ""
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