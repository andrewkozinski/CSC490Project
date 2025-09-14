from pydantic import BaseModel

class Book(BaseModel):
    id: str
    title: str
    description: str
    author: str
    release_date: str
    isbn: str