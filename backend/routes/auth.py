import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from database.users import get_all_users, get_by_email, add_user

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

    #Actually call into the DB
    user = get_by_email(request.email)
    if user:
        # Verify the hashed password
        if bcrypt.checkpw(request.password.encode(), user["HASHED_PASSWORD"]):
            token = create_jwt_token({"sub": request.email, "username": user["USERNAME"]})
            return {
                "user_id": user["USER_ID"],
                "name": user["USERNAME"],
                "email": request.email,
                "token": token
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid username or password")
    return None

@router.post("/register")
async def register(request: SignUpRequest):
    if request.username and request.password:
        #Hash the password
        hashed_password = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        #Insert into DB here
        user_id = add_user(request.username, hashed_password, request.email)
        #Create JWT token
        token = create_jwt_token({"sub": request.email, "username": request.username})
        return {
            "id": user_id,
            "username": request.username,
            "email": request.email,
            "token": token
        }
    raise HTTPException(status_code=400, detail="Invalid registration details")

@router.post("/getallusers")
async def get_users():
    users = get_all_users()
    print(users)
    if users is not None:
        return {"users": users}
    raise HTTPException(status_code=500, detail="Error fetching users")
