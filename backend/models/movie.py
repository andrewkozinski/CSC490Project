from typing import List
from pydantic import BaseModel

class Movie(BaseModel):
    id: str
    title: str
    genre: List[str]
    director: str
    year: str
    release_date: str
    overview: str
    img: str
