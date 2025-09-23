from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignUpRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    # Dummy authentication logic
    if request.email == "admin@gmail.com" and request.password == "password":
        return {"token": "DUMMY-TOKEN"}
    raise HTTPException(status_code=401, detail="Invalid username or password"
)

@router.post("/register")
async def register(request: SignUpRequest):
    # Dummy registration logic
    if request.username and request.password:
        return {"message": "User registered successfully"}
    raise HTTPException(status_code=400, detail="Invalid registration details")