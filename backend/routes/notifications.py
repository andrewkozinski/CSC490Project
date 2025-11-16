from fastapi import HTTPException, APIRouter
from routes.auth import verify_jwt_token, get_user_id_from_token
from routes.movies import get_movie
from routes.tvshows import get_tvshow
from routes.books import get_book_details
from routes.profiles import get_user_info_by_id
from database.reviews import get_review_by_review_id
from database.comments import get_comment_by_comm_id
from database import notifications

router = APIRouter()

async def get_poster_url_and_title(media_type: str, media_id: str) -> (str,str):
    print(f"Fetching poster URL for media_type: {media_type}, media_id: {media_id}")

    if media_type == "movie":
        movie = await get_movie(int(media_id))
        return movie.img, movie.title
    elif media_type == "tvshow":
        tvshow = await get_tvshow(int(media_id))
        return tvshow.img, tvshow.title
    elif media_type == "book":
        book = await get_book_details(media_id)
        return book.thumbnailUrl, book.title
    return ""

@router.get("/user_id/{user_id}")
async def get_notifications_by_user_id(user_id: str):
    # Verify JWT token
    #verify_jwt_token(jwt_token)
    #user_id = get_user_id_from_token(jwt_token)
    notifs = notifications.get_notifications_by_user_id(user_id)
    if notifs is not None:
        #return {"notifications": notifs}
        for notif in notifs:

            notif["notif_message"] = ""

            # Get the review associated with a notification
            if notif["review_id"] or notif["comment_id"]:
                review = get_review_by_review_id(notif["review_id"])
                if review:

                    review["img"], review["media_title"] = await get_poster_url_and_title(review["media_type"], review["media_id"])

                    notif["review_content"] = review

                    base_message = f"Your review on {review['media_title']} "

                    if notif["noti_type"] == "U":
                        notif["notif_message"] = base_message + "has been upvoted."
                    elif notif["noti_type"] == "D":
                        notif["notif_message"] = base_message + "has been downvoted."
                    elif notif["noti_type"] == "C":
                        notif["notif_message"] = base_message + "Your review has a new comment."
                    else: # Fallback message
                        notif["notif_message"] = f"Your review on {review['media_title']} has a new notification."

                    media_type = ""
                    if review["media_type"] == "movie" or review["media_type"] == "book":
                        media_type = review["media_type"].lower() + "s"  # e.g., "movie" -> "movies"
                    else:
                        media_type = "tv"
                    notif["link"] = f"/{media_type}/review/{review["media_id"]}"

            if notif["comment_id"]:
                comment = get_comment_by_comm_id(notif["comment_id"])
                if comment:
                    notif["comment_content"] = comment

                    base_message = f"Your comment on {notif["review_content"]['media_title']} "

                    if notif["noti_type"] == "U":
                        notif["notif_message"] = base_message + "has been upvoted."
                    elif notif["noti_type"] == "D":
                        notif["notif_message"] = base_message + "has been downvoted."
                    elif notif["noti_type"] == "C":
                        notif["notif_message"] = base_message + "has a new reply."
                    else: # Fallback message
                        notif["notif_message"] = f"Your comment on {notif["review_content"]['media_title']} has a new notification."

            if notif["noti_type"] == "F":

                #Get the user who followed
                follower_info = await get_user_info_by_id(notif["action_user_id"])

                print(f"Follower info: {follower_info}")

                if follower_info:
                    notif["follower_username"] = follower_info["username"]
                    notif["notif_message"] = f"{follower_info['username']} has started following you."
                    notif["link"] = f"/profile/{follower_info['user_id']}"
                    notif["img"] = follower_info["profile_pic_url"]

            # Set image if review has one
            if notif["review_id"] is not None and notif["review_content"]["img"] is not None:
                notif["img"] = notif["review_content"]["img"]
            elif notif["img"] == "": #No image available
                notif["img"] = "https://placehold.co/100x150?text=No+Image"

            # Fallback message
            if notif["notif_message"] == "":
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