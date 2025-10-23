from fastapi import APIRouter, HTTPException
from database.users import get_by_id

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