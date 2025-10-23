from fastapi import APIRouter, HTTPException
from database.users import get_by_id
from database import profile
from routes.auth import verify_jwt_token, get_user_id_from_token

router = APIRouter()

@router.get("/get_username_by_id")
async def get_username_by_id(user_id: int):
    user = get_by_id(user_id)
    if user:
        return user["USERNAME"]
    else:
        raise HTTPException(status_code=404, detail="User not found")
    

@router.get("/get/user_information")
async def get_user_info_by_id(user_id: int):
    user = get_by_id(user_id)
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")

@router.put("/update_bio")
async def update_bio(jwt_token: str, new_bio: str):
    #Validate JWT token
    verify_jwt_token(jwt_token)

    #Get user id from token
    user_id = get_user_id_from_token(jwt_token)

    #Update bio in DB
    result = profile.update_bio(user_id, new_bio)
    if result is False:
        raise HTTPException(status_code=500, detail="Failed to update bio. Please try again.")
    return {"message": "Bio updated successfully"}
