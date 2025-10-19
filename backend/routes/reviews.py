from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import reviews, vote
from database.trending_books import convert_book_id_back_to_str as get_book_str_from_id
from routes.auth import verify_jwt_token, get_user_id_from_token
from routes.profiles import get_username_by_id
from routes import books, movies, tvshows

class CreateReviewRequest(BaseModel):
    #user_id: int #Commented out since JWT token will provide user id
    media_id: str
    media_type: str  # "movie", "tvshow", "book"
    rating: int
    review_text: str
    jwt_token: str # JWT token for authentication

class DeleteReviewRequest(BaseModel):
    review_id: int
    jwt_token: str

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
        #Also initialize votes for the review
        vote_result = vote.add_vote(review_id, None, 0, 0)
        return {"message": "Review created successfully", "review_id": review_id}
    else:
        raise HTTPException(status_code=500, detail="Failed to create review. Please try again.")

@router.put("/edit/{review_id}")
async def edit_review(review_id: int, review_text: str, jwt_token: str):
    result = reviews.edit_review(review_id, review_text)
    if result is False:
        raise HTTPException(status_code=404, detail="An error occurred, review not found.")
    return {"message": "Review updated successfully"}

@router.delete("/delete/{review_id}")
async def delete_review(delete_request: DeleteReviewRequest):
    #Need to validate the JWT token here before allowing the user to delete a review
    verify_jwt_token(delete_request.jwt_token)

    #Then delete the review
    result = reviews.delete_review(delete_request.review_id)
    if result is False:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}

@router.get("/all")
async def get_all_reviews():
    all_reviews = reviews.get_all_reviews()

    for review in all_reviews:
        #user = await get_username_by_id(review["user_id"])
        #review["username"] = user if user else "Unknown User"
        votes = vote.get_vote_by_review_id(review["review_id"])
        review["votes"] = votes if votes else {"upvotes": 0, "downvotes": 0}

    return {"reviews": all_reviews}

#get all reviews by media type: book, tv shows, movies
@router.get("/by_media_type/{media_type}")
async def get_reviews_by_media_type(media_type: str):
    reviews_by_type = reviews.get_reviews_by_media_type(media_type.lower())
    if reviews_by_type is None:
        #Return empty list if no reviews found for the media type
        return {"reviews": []}
    # Add username to each review by fetching from the user id, and also vote id
    for review in reviews_by_type:
        user = await get_username_by_id(review["user_id"])
        review["username"] = user if user else "Unknown User"
        votes = vote.get_vote_by_review_id(review["review_id"])
        review["votes"] = votes if votes else {"upvotes": 0, "downvotes": 0}
    return {"reviews": reviews_by_type}

#Get all reviews by a media type and id
@router.get("/by_media/{media_type}/{media_id}")
async def get_reviews_by_media_type_and_id(media_type: str, media_id: str):
    reviews_by_media_and_id = reviews.get_reviews_by_media_id_and_type(media_id, media_type.lower())
    if reviews_by_media_and_id is None:
        return {"reviews": []}

    #Add username to each review by fetching from the user id
    #Also add vote id for each review
    for review in reviews_by_media_and_id:
        print("USER ID : ", review["user_id"])
        user = await get_username_by_id(review["user_id"])
        review["username"] = user if user else "Unknown User"
        votes = vote.get_vote_by_review_id(review["review_id"])
        review["votes"] = votes if votes else {"upvotes": 0, "downvotes": 0}

    return {"reviews": reviews_by_media_and_id}

#Get all reviews by a user id
@router.get("/by_user/{user_id}")
async def get_reviews_by_user(user_id: int):
    reviews_by_user = reviews.get_reviews_by_user_id(user_id)

    #Attach vote information to each review
    for review in reviews_by_user:
        votes = vote.get_vote_by_review_id(review["review_id"])
        review["votes"] = votes if votes else {"upvotes": 0, "downvotes": 0}

    return {"reviews": reviews_by_user}

#Get all reviews made by a user id for a specific media type
@router.get("/by_user_and_media_type/{user_id}/{media_type}")
async def get_reviews_by_user_and_media_type(user_id: int, media_type: str):
    reviews_by_user_and_type = reviews.get_reviews_by_user_id_and_media_type(user_id, media_type.lower())

    for review in reviews_by_user_and_type:
        votes = vote.get_vote_by_review_id(review["review_id"])
        review["votes"] = votes if votes else {"upvotes": 0, "downvotes": 0}

    return {"reviews": reviews_by_user_and_type}

#Get all reviews made by a user id for a specific media type and media id
@router.get("/by_user_and_media/{user_id}/{media_type}/{media_id}")
async def get_reviews_by_user_and_media(user_id: int, media_type: str, media_id: str):
    reviews_by_user_and_media = reviews.get_reviews_by_user_id_and_media_id_and_media_type(user_id, media_id, media_type.lower())

    for review in reviews_by_user_and_media:
        votes = vote.get_vote_by_review_id(review["review_id"])
        review["votes"] = votes if votes else {"upvotes": 0, "downvotes": 0}

    return {"reviews": reviews_by_user_and_media}

#Initialize votes for every review
@router.post("/initialize_votes_for_all_reviews")
async def initialize_votes_for_all_reviews():
    all_reviews = reviews.get_all_reviews()
    if all_reviews is None:
        raise HTTPException(status_code=500, detail="Error fetching reviews")
    for review in all_reviews:
        review_id = review["review_id"]
        vote_result = vote.add_vote(review_id, None, 0, 0)
        if vote_result is False:
            print(f"Error initializing votes for review ID {review_id}")
    return {"message": "Votes initialized for all reviews"}

@router.get("/get_review_data/{media_type}/{media_id}")
async def get_review_data(media_type: str, media_id: str):
    #Call the appropriate function based on media type
    try:
        if media_type == "movie":
            return await movies.get_movie(int(media_id))
        elif media_type == "tvshow":
            return await tvshows.get_tvshow(int(media_id))
        elif media_type == "book":
            return await books.get_book_details(media_id)
        raise HTTPException(status_code=400, detail="Invalid media type")
    except:
        raise HTTPException(status_code=500, detail="Error fetching media details")

@router.get("/get_recent_reviews")
async def get_recent_reviews(limit: int = 3):
    recent_reviews = reviews.get_recent_reviews(limit)
    if recent_reviews is None:
        return {"reviews": []}

    for review in recent_reviews:
        user = await get_username_by_id(review["user_id"])
        review["username"] = user if user else "Unknown User"
        votes = vote.get_vote_by_review_id(review["review_id"])
        review["votes"] = votes if votes else {"upvotes": 0, "downvotes": 0}

        #Get data for the reviewed item

        if review["media_type"] == "book":
            #Convert media_id to book id string
            review["media_id"] = get_book_str_from_id(review["media_id"])

        media_data = await get_review_data(review["media_type"], review["media_id"])
        review["full_media_data"] = media_data if media_data else {}

        if media_data:
            if review["media_type"] == "book":
                #print("MEDIA DATA FOR BOOK REVIEW:", media_data)
                review["img"] = media_data.thumbnailUrl
                review["title"] = media_data.title
                review["media_type"] = "books"
            elif review["media_type"] == "movie":
                review["img"] = media_data.img
                review["title"] = media_data.title
                review["media_type"] = "movies"
            elif review["media_type"] == "tvshow":
                review["img"] = media_data.img
                review["title"] = media_data.title
                review["media_type"] = "tv"


    return {"reviews": recent_reviews}
