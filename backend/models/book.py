from typing import List

from pydantic import BaseModel

class Book(BaseModel):
    id: str
    title: str
    description: str
    authors: List[str]
    date_published: str
    categories: List[str]
    pageCount: int
    thumbnailUrl: str
    thumbnailExtraLargeUrl: str
    isbn_10: str
    isbn_13: str