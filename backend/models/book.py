from typing import List

from pydantic import BaseModel

#New book model, based on OpenLibrary data
class Book(BaseModel):
    id: str
    title: str
    description: str
    authors: List[str]
    date_published: str
    categories: List[str]
    #pageCount: int
    thumbnailUrl: str
    #isbn_10: str
    #isbn_13: str
    avgRating: float = 0.0 #Optional, only needed for individual book details page

""" OLD BOOK MODEL
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
"""