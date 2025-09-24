import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import jwt
from datetime import datetime, timedelta, timezone

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

# Function to create JWT token
def create_jwt_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Routing setup:
router = APIRouter()


# Pydantic models for request bodies
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
        token = create_jwt_token({"sub": request.email, "username": "admin"})
        return {
            "user_id": 1,
            "name": "admin",
            "email": request.email,
            "token": token
        }
    raise HTTPException(status_code=401, detail="Invalid username or password")

@router.post("/register")
async def register(request: SignUpRequest):
    if request.username and request.password:
        token = create_jwt_token({"sub": request.email, "username": request.username})
        #Dummy logic for now, will update to use db soon
        return {
            "id": 1,
            "username": request.username,
            "email": request.email,
            "token": token
        }
    raise HTTPException(status_code=400, detail="Invalid registration details")