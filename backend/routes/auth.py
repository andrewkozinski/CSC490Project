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

#Function to verify if a token is expired or not
def verify_jwt_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

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
        if bcrypt.checkpw(request.password.encode('utf-8'), user["HASHED_PASSWORD"].encode('utf-8')):
            token = create_jwt_token({"sub": request.email, "username": user["USERNAME"], "user_id": user["USER_ID"]})
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

        #Actually call into the DB
        result = add_user(request.username, hashed_password, request.email)
        #Check for errors during user creation
        if "error" in result:
            raise HTTPException(status_code=result["code"], detail=result["error"])

        #Create a JWT token for the newly registered user
        token = create_jwt_token({"sub": request.email, "username": request.username})
        return {
            "id": result["user_id"],
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

class TokenRequest(BaseModel):
    token: str

#Check if a token is valid
@router.post("/verifytoken")
async def verify_token(request: TokenRequest):
    print("Request made by token: ", request.token)
    payload = verify_jwt_token(request.token)
    return {"valid": True, "payload": payload}