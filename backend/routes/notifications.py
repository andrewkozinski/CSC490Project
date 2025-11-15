from fastapi import HTTPException, APIRouter
from routes.auth import verify_jwt_token, get_user_id_from_token
from database.reviews import get_review_by_review_id
from database.comments import get_comment_by_comm_id
from database import notifications

router = APIRouter()

@router.get("/user_id/{user_id}")
async def get_notifications_by_user_id(user_id: str):
    # Verify JWT token
    #verify_jwt_token(jwt_token)
    #user_id = get_user_id_from_token(jwt_token)
    notifs = notifications.get_notifications_by_user_id(user_id)
    if notifs is not None:
        #return {"notifications": notifs}
        for notif in notifs:
            # Get the review associated with a notification
            if notif["review_id"] or notif["comment_id"]:
                review = get_review_by_review_id(notif["review_id"])
                if review:
                    notif["review_content"] = review

                    if notif["noti_type"] == "U":
                        notif["notif_message"] = "Your review has been upvoted."
                    elif notif["noti_type"] == "D":
                        notif["notif_message"] = "Your review has been downvoted."
                    elif notif["noti_type"] == "C":
                        notif["notif_message"] = "Your review has a new comment."
                    else: # Fallback message
                        notif["notif_message"] = "You have a new notification regarding your review."

                    media_type = ""
                    if review["media_type"] == "movie" or review["media_type"] == "book":
                        media_type = review["media_type"].lower() + "s"  # e.g., "movie" -> "movies"
                    else:
                        media_type = "tv"
                    notif["link"] = f"/{media_type}/{review["media_id"]}/reviews/{review["review_id"]}"

            if notif["comment_id"]:
                comment = get_comment_by_comm_id(notif["comment_id"])
                if comment:
                    notif["comment_content"] = comment

                    if notif["noti_type"] == "U":
                        notif["notif_message"] = "Your comment has been upvoted."
                    elif notif["noti_type"] == "D":
                        notif["notif_message"] = "Your comment has been downvoted."
                    elif notif["noti_type"] == "C":
                        notif["notif_message"] = "Your comment has a new reply."
                    else: # Fallback message
                        notif["notif_message"] = "You have a new notification regarding your comment."

            # Fallback message
            if notif["notif_message"] is None:
                notif["notif_message"] = "You have a new notification."
        return notifs
    raise HTTPException(status_code=500, detail="Error fetching notifications")

@router.get("/count")
async def get_notification_count(user_id: str):
    # Verify JWT token
    #verify_jwt_token(jwt_token)
    #user_id = get_user_id_from_token(jwt_token)
    count = notifications.get_notification_count_by_user_id(user_id)
    if count is not None:
        return {"unread_count": count}
    raise HTTPException(status_code=500, detail="Error fetching notification count")

@router.put("/read/{noti_id}")
async def read_notification(noti_id: int, jwt_token: str):
    # Verify JWT token
    verify_jwt_token(jwt_token)
    result = notifications.read_notification(noti_id)
    if result is not None:
        return {"message": "Notification marked as read"}
    raise HTTPException(status_code=500, detail="Error marking notification as read")