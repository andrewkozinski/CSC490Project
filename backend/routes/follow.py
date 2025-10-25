from fastapi import APIRouter, HTTPException
import database.following
import database.users
import routes.profiles
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

@router.get("/followers/{follow_id}")
async def get_followers(follow_id: int):
    followers = database.following.get_all_followers(follow_id)
    if followers is not None:
        #Let's format the followers to include username and profile picture
        formatted_followers = []
        for follower in followers:
            user_id = follower["follow_id"]
            profile = await routes.profiles.get_user_info_by_id(user_id)
            formatted_followers.append({
                "user_id": user_id,
                "username": profile["username"] if profile else "Unknown",
                "profile_pic_url": profile["profile_pic_url"] if profile else "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg",
                "bio": profile["bio"] if profile else "",
            })
        return {"followers": formatted_followers}
    raise HTTPException(status_code=500, detail="Error fetching followers")

@router.get("/following/{user_id}")
async def get_following(user_id: int):
    following = database.following.get_user_following_list(user_id)
    if following is not None:
        #Same as previous function, we're formatting the following list to include username and profile picture
        formatted_following = []
        for follow in following:
            follow_id = follow
            profile = await routes.profiles.get_user_info_by_id(follow_id)
            formatted_following.append({
                "user_id": follow_id,
                "username": profile["username"] if profile else "Unknown",
                "profile_pic_url": profile["profile_pic_url"] if profile else "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg",
                "bio": profile["bio"] if profile else "",
            })
        return {"following": formatted_following}
    raise HTTPException(status_code=500, detail="Error fetching following")