from typing import List
from pydantic import BaseModel


class TvShow(BaseModel):
    id: str
    title: str
    created_by: List[str]
    release_date: str
    seasons: int
    episodes: int
    img: str