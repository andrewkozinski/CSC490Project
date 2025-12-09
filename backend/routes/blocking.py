from aiocache import cached, Cache, caches
from fastapi import APIRouter, HTTPException
from routes.auth import verify_jwt_token, get_user_id_from_token
from database import block

router = APIRouter()

#Block a user
@router.post("/block/user_id/{user_id_to_block}")
async def block_user(user_id_to_block: int, jwt_token: str):
    #Verify JWT token
    verify_jwt_token(jwt_token)

    user_id = get_user_id_from_token(jwt_token)

    #Block the user
    result = block.add_block(user_id, user_id_to_block)

    if result["code"] != 201:
        raise HTTPException(status_code=result["code"], detail=result["error"])
    #Clear cache
    caches.get("blocking").delete(f"is_blocked_{user_id}_{user_id_to_block}")
    return {"message": f"User {user_id_to_block} has been blocked."}

#Unblock a user
@router.post("/unblock/user_id/{user_id_to_unblock}")
async def unblock_user(user_id_to_unblock: int, jwt_token: str):
    #Verify JWT token
    verify_jwt_token(jwt_token)

    user_id = get_user_id_from_token(jwt_token)

    #Unblock the user
    result = block.remove_block(user_id, user_id_to_unblock)

    if result["code"] != 200:
        raise HTTPException(status_code=result["code"], detail=result["error"])
    #Clear cache
    caches.get("blocking").delete(f"is_blocked_{user_id}_{user_id_to_unblock}")
    return {"message": f"User {user_id_to_unblock} has been unblocked."}

#Check if a user is blocked
@router.get("/is_blocked/user_id/{user_id_to_check}")
@cached(alias="blocking", ttl=600, cache=Cache.MEMORY, key_builder=lambda f, user_id_to_check, user_id: f"is_blocked_{user_id}_{user_id_to_check}")
async def is_user_blocked(user_id_to_check: int, user_id: int):

    result = block.is_user_blocked(user_id, user_id_to_check)

    # if result["error"] is not None:
    #     raise HTTPException(status_code=result["code"], detail=result["error"])

    return {
        "user_id_checked": user_id_to_check,
        "is_blocked": result
    }

#Get all users a user has been blocked by
@router.get("/blocked_by/user_id/{user_id}")
async def get_blocked_by(user_id: int):

    result = block.get_blocked_by(user_id)

    if result is None:
        raise HTTPException(status_code=500, detail="Error fetching blocked by list")

    return {
        "user_id": user_id,
        "blocked_by": result
    }