from pydantic import BaseModel


class TvShow(BaseModel):
    id: str
    title: str
    director: str
    release_date: str
    seasons: int
    episodes: int