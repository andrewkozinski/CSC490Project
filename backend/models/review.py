from pydantic import BaseModel

class Review(BaseModel):
    id: int
    content: str