from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    # Dummy authentication logic
    if request.username == "admin" and request.password == "password":
        return {"token": "DUMMY-TOKEN"}
    raise HTTPException(status_code=401, detail="Invalid username or password"
)
