from fastapi import APIRouter
from database import settings_text
from routes.auth import verify_jwt_token, get_user_id_from_token

router = APIRouter()

@router.get("/review_text/is_enabled")
async def get_review_text_setting(jwt_token: str):

    # Verify JWT token
    verify_jwt_token(jwt_token)

    user_id = get_user_id_from_token(jwt_token)

    # Fetch the setting from the database
    setting = settings_text.get_settings_by_user_id(user_id)

    if setting is None:
        return {
            "review_text_enabled": True,
            "dark_mode_enabled": False
                }

    return {
        "setting_id": setting["setting_id"],
        "review_text_enabled": bool(setting["review_text_enabled"]),
        "dark_mode_enabled": bool(setting["dark_mode_enabled"])
    }

@router.put("/review_text")
async def update_review_text_setting(review_text_setting: bool, jwt_token: str):

    # Verify JWT token
    verify_jwt_token(jwt_token)

    user_id = get_user_id_from_token(jwt_token)

    # Update the setting in the database
    result = settings_text.update_review_text_enabled(user_id, int(review_text_setting))

    if result is False:
        return {"message": "Failed to update review text setting."}


@router.put("/dark_mode")
async def update_dark_mode_setting(dark_mode_setting: bool, jwt_token: str):

    # Verify JWT token
    verify_jwt_token(jwt_token)

    user_id = get_user_id_from_token(jwt_token)

    # Update the setting in the database
    result = settings_text.update_dark_mode_enabled(user_id, int(dark_mode_setting))

    if result is False:
        return {"message": "Failed to update dark mode setting."}
    return {"message": "Dark mode setting updated successfully."}