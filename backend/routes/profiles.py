from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi_cache.decorator import cache
from fastapi_cache import FastAPICache
from database.users import get_by_id, get_all_users
from database import profile
from routes.auth import verify_jwt_token, get_user_id_from_token
from routes import auth
import os

router = APIRouter()

UPLOAD_DIR = "../uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/get_username_by_id")
@cache(namespace="profile", expire=3600)  # Cache the response for 1 hour (3600 seconds)
async def get_username_by_id(user_id: int):
    user = get_by_id(user_id)
    if user:
        return user["USERNAME"]
    else:
        raise HTTPException(status_code=404, detail="User not found")

@router.get("/add_profile_for_existing_users")
async def add_profile_for_existing_users():
    users = get_all_users()
    for user in users:
        user_id = user["USER_ID"]
        print("USER", user)
        existing_profile = profile.get_profile(user_id)
        if not existing_profile:
            result = profile.create_profile(user_id, "No description.")
            if result is False:
                raise HTTPException(status_code=500, detail=f"Failed to create profile for user ID {user_id}")
            else:
                print(f"Profile created for user ID {user_id}")
    return {"message": "Profiles created successfully"}

@router.get("/get/user_information")
@cache(namespace="profile", expire=3600)  # Cache the response for 1 hour (3600 seconds)
async def get_user_info_by_id(user_id: int):
    user = get_by_id(user_id)
    user_profile = profile.get_profile(user_id)
    print(user_profile)
    if user and user_profile:
        #Format it so that we return username, email, bio, profile_picture_url
        return {
            "username": user["USERNAME"],
            "user_id": user["USER_ID"],
            "email": user["EMAIL"],
            "bio": user_profile["bio"],
            "profile_picture": user_profile["profile_pic"],
            "profile_pic_url": user_profile["profile_pic_url"]
        }
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
    await FastAPICache.clear(namespace="profile")  # Clear the cache to reflect updated bio
    return {"message": "Bio updated successfully"}


#Upload profile picture
@router.put("/update_profile_picture")
async def update_profile_picture(jwt_token: str, profile_pic_file: UploadFile = File(...)):
    if profile_pic_file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")

    #For testing purposes, save file locally
    # file_path = os.path.join(UPLOAD_DIR, profile_pic_file.filename)
    # with open(file_path, "wb") as f:
    #     f.write(await profile_pic_file.read())
    # return {"filename:": profile_pic_file.filename, "contenttype": profile_pic_file.content_type}

    #Validate JWT token
    verify_jwt_token(jwt_token)

    #Get user id from token
    user_id = get_user_id_from_token(jwt_token)


    #Read file bytes
    file_bytes = await profile_pic_file.read()
    file_extension = profile_pic_file.filename.split(".")[-1]

    #print(file_bytes)
    #print(file_extension)

    #Update profile picture in DB
    result = profile.profile_picture_upload(user_id, file_bytes, file_extension)
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to update profile picture. Please try again.")
    await FastAPICache.clear(namespace="profile")  # Clear the cache to reflect updated profile picture
    return {"pfp_url": result,"message": "Profile picture updated successfully"}

@router.get("/all_profiles")
@cache(namespace="profile", expire=3600)  # Cache the response for 1 hour (3600 seconds)
async def get_all_profiles():
    result = profile.get_all_profiles()
    if result is False:
        raise HTTPException(status_code=404, detail="An error occurred")
    return {"profiles": result}