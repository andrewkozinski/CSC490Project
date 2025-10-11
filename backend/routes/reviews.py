from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import reviews
from routes.auth import verify_jwt_token, get_user_id_from_token
from routes.profiles import get_username_by_id

class CreateReviewRequest(BaseModel):
    #user_id: int #Commented out since JWT token will provide user id
    media_id: str
    media_type: str  # "movie", "tvshow", "book"
    rating: int
    review_text: str
    jwt_token: str # JWT token for authentication

class DeleteReviewRequest(BaseModel):
    review_id: int

router = APIRouter()

#Need routes to post, get, update, delete reviews
@router.post("/create")
async def create_review(review: CreateReviewRequest):

    #Need to validate the JWT token here before allowing the user to create a review
    verify_jwt_token(review.jwt_token)

    #Get user id from the JWT token
    jwt_id = get_user_id_from_token(review.jwt_token)

    print("REVIEW REQUEST:")
    print(jwt_id)
    print(review.media_id)
    print(review.media_type)

    review_id = reviews.add_review(
        user_id=jwt_id,
        media_id=review.media_id,
        media_type=review.media_type,
        rating=review.rating,
        review_text=review.review_text
    )
    if review_id is not None:
        return {"message": "Review created successfully", "review_id": review_id}
    else:
        HTTPException(status_code=500, detail="Failed to create review. Please try again.")

@router.put("/edit/{review_id}")
async def edit_review(review_id: int, review_text: str):
    result = reviews.edit_review(review_id, review_text)
    if result is False:
        raise HTTPException(status_code=404, detail="An error occurred, review not found.")
    return {"message": "Review updated successfully"}

@router.delete("/delete/{review_id}")
async def delete_review(review_id: int):
    result = reviews.delete_review(review_id)
    if result is False:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}

@router.get("/all")
async def get_all_reviews():
    all_reviews = reviews.get_all_reviews()
    return {"reviews": all_reviews}

#get all reviews by media type: book, tv shows, movies
@router.get("/by_media_type/{media_type}")
async def get_reviews_by_media_type(media_type: str):
    reviews_by_type = reviews.get_reviews_by_media_type(media_type.lower())
    if reviews_by_type is None:
        #Return empty list if no reviews found for the media type
        return {"reviews": []}
    #Add username to each review by fetching from the user id
    for review in reviews_by_type:
        user = get_username_by_id(review["user_id"])
        review["username"] = user if user else "Unknown User"
    return {"reviews": reviews_by_type}

#Get all reviews by a media type and id
@router.get("/by_media/{media_type}/{media_id}")
async def get_reviews_by_media(media_type: str, media_id: str):
    reviews_by_media = reviews.get_reviews_by_media_id_and_type(media_id, media_type.lower())
    if reviews_by_media is None:
        return {"reviews": []}
    return {"reviews": reviews_by_media}

#Get all reviews by a user id
@router.get("/by_user/{user_id}")
async def get_reviews_by_user(user_id: int):
    reviews_by_user = reviews.get_reviews_by_user_id(user_id)
    return {"reviews": reviews_by_user}

#Get all reviews made by a user id for a specific media type
@router.get("/by_user_and_media_type/{user_id}/{media_type}")
async def get_reviews_by_user_and_media_type(user_id: int, media_type: str):
    reviews_by_user_and_type = reviews.get_reviews_by_user_id_and_media_type(user_id, media_type.lower())
    return {"reviews": reviews_by_user_and_type}

#Get all reviews made by a user id for a specific media type and media id
@router.get("/by_user_and_media/{user_id}/{media_type}/{media_id}")
async def get_reviews_by_user_and_media(user_id: int, media_type: str, media_id: str):
    reviews_by_user_and_media = reviews.get_reviews_by_user_id_and_media_id_and_media_type(user_id, media_id, media_type.lower())
    return {"reviews": reviews_by_user_and_media}