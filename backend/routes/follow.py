from fastapi import APIRouter, HTTPException
import database.following
import database.users
from routes.auth import verify_jwt_token, get_user_id_from_token

router = APIRouter()

#Note:
#the user id is the person that is following and follow id is the person that is being followed

@router.post("/follow/{follow_id}")
async def follow_user(follow_id: int, jwt_token: str):
    # Verify JWT token
    verify_jwt_token(jwt_token)

    # Get the user_id from the token
    user_id = get_user_id_from_token(jwt_token)

    # Check if the user to follow exists
    user_to_follow = database.users.get_by_id(follow_id)
    if user_to_follow is None:
        raise HTTPException(status_code=404, detail="User to follow not found")

    # Add follow relationship
    result = database.following.add_follower(follow_id, user_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error following user")
    return {"message": "User followed successfully"}

@router.post("/unfollow/{follow_id}")
async def unfollow_user(follow_id: int, jwt_token: str):
    # Verify JWT token
    verify_jwt_token(jwt_token)

    # Get the user_id from the token
    user_id = get_user_id_from_token(jwt_token)

    # Remove follow relationship
    result = database.following.delete_follower(follow_id, user_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error unfollowing user")
    return {"message": "User unfollowed successfully"}

@router.get("/is_following/{follow_id}")
async def is_following(follow_id: int, jwt_token: str):
    # Verify JWT token
    verify_jwt_token(jwt_token)

    # Get the user_id from the token
    user_id = get_user_id_from_token(jwt_token)

    # Check if following relationship exists
    exists = database.following.follower_exists(follow_id, user_id)
    return {"is_following": exists}
