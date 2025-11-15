from fastapi import HTTPException, APIRouter
from routes.auth import verify_jwt_token, get_user_id_from_token
from database.reviews import get_review_by_review_id
from database.comments import get_comment_by_comm_id
from database import notifications

router = APIRouter()

@router.get("/notifications/user_id/{user_id}")
async def get_notifications_by_user_id(user_id: str):
    # Verify JWT token
    #verify_jwt_token(jwt_token)
    #user_id = get_user_id_from_token(jwt_token)
    notifs = notifications.get_notifications_by_user_id(user_id)
    if notifs is not None:
        #return {"notifications": notifs}
        for notif in notifs:
            # Get the review associated with a notification
            if notif["review_id"]:
                review = get_review_by_review_id(notif["review_id"])
                if review:
                    notif["review_content"] = review
            if notif["comment_id"]:
                comment = get_comment_by_comm_id(notif["comment_id"])
                if comment:
                    notif["comment_content"] = comment
        return notifs
    raise HTTPException(status_code=500, detail="Error fetching notifications")

@router.get("/notifications/count")
async def get_notification_count(user_id: str):
    # Verify JWT token
    #verify_jwt_token(jwt_token)
    #user_id = get_user_id_from_token(jwt_token)
    count = notifications.get_notification_count_by_user_id(user_id)
    if count is not None:
        return {"unread_count": count}
    raise HTTPException(status_code=500, detail="Error fetching notification count")

@router.put("/notifications/read/{noti_id}")
async def read_notification(noti_id: int, jwt_token: str):
    # Verify JWT token
    verify_jwt_token(jwt_token)
    result = notifications.read_notification(noti_id)
    if result is not None:
        return {"message": "Notification marked as read"}
    raise HTTPException(status_code=500, detail="Error marking notification as read")