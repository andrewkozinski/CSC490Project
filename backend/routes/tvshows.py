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
        return response.json()



