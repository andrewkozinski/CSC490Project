from fastapi import APIRouter, HTTPException
from database.vote import add_vote, delete_vote, increment_upvote, decrement_upvote, increment_downvote, decrement_downvote, get_vote_id_by_review_and_comment_id, get_all_votes
from database.user_vote import vote_exists, add_user_vote, delete_user_vote, delete_all_user_vote, get_vote_type, get_all_user_votes
from routes.auth import verify_jwt_token, get_user_id_from_token

router = APIRouter()

#Initializes votes for a review or comment
@router.post("/initialize_votes/")
async def initialize_votes(review_id: int = None, comment_id: int = None):

    if(review_id is None and comment_id is None):
        raise HTTPException(status_code=400, detail="Either review_id or comment_id must be provided")

    result = add_vote(review_id, comment_id, 0, 0)
    if result is False:
        raise HTTPException(status_code=500, detail="Error initializing votes for review")
    return {"message": "Votes initialized successfully"}

@router.get("/get_all_votes")
async def get_user_votes():
    votes = get_all_user_votes()
    if votes is not None:
        return {"user_votes": votes}
    raise HTTPException(status_code=500, detail="Error fetching user votes")

#Increments upvote count for a review or comment
@router.put("/upvote/{vote_id}")
async def upvote(vote_id: int, jwt_token: str):

    #Verify JWT token
    verify_jwt_token(jwt_token)

    #Get the user_id from the token
    user_id = get_user_id_from_token(jwt_token)

    #Check if the user has already upvoted
    existing_vote = get_vote_type(user_id, vote_id)

    if existing_vote is None:
        #Add user vote record
        add_user_vote(user_id, vote_id, "U")
        result = increment_upvote(vote_id)
        #Check if there was an error
        if result is False:
            raise HTTPException(status_code=500, detail="Error upvoting")
        return {"message": "Upvoted successfully, upvote count incremented"}
    elif existing_vote == "U":
        #Already has an upvote, do nothing or return a message
        return {"message": "User has already upvoted"}
    elif existing_vote == "D":
        #User had downvoted before, remove downvote and add upvote
        delete_user_vote(user_id, vote_id)
        add_user_vote(user_id, vote_id, "U")
        decrement_downvote(vote_id)
        result = increment_upvote(vote_id)
        if result is False:
            raise HTTPException(status_code=500, detail="Error changing downvote to upvote")
        return {"message": "Changed downvote to upvote successfully"}

    raise HTTPException(status_code=500, detail="Unexpected error during upvote")

#Decrements upvote count for a review or comment
@router.put("/remove_upvote/{vote_id}")
async def remove_upvote(vote_id: int):
    result = decrement_upvote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error removing upvote")
    return {"message": "Upvote removed successfully, upvote count decremented"}

#Increments downvote count for a review or comment
@router.put("/downvote/{vote_id}")
async def downvote(vote_id : int):
    result = increment_downvote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error downvoting")
    return {"message": "Downvoted successfully, downvote count incremented"}


#Decrements downvote count for a review or comment
@router.put("/remove_downvote/{vote_id}")
async def remove_downvote(vote_id: int):
    result = decrement_downvote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error removing downvote")
    return {"message": "Downvote removed successfully, downvote count decremented"}

#Deletes vote record for a review or comment
#Not sure why we'd need this one but why not
@router.delete("/delete/{review_id}")
async def delete_votes(review_id: int = None, comment_id: int = None):
    vote_id = get_vote_id_by_review_and_comment_id(review_id, comment_id) # Get the vote ID
    if vote_id is None:
        raise HTTPException(status_code=404, detail="Vote record not found")
    result = delete_vote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error deleting votes")
    return {"message": "Votes deleted successfully"}

@router.get("/fetch/vote_id/")
async def fetch_vote_id(review_id: int = None, comment_id: int = None):
    vote_id = get_vote_id_by_review_and_comment_id(review_id, comment_id)
    return {"vote_id": vote_id}

@router.get("/all_votes")
async def fetch_all_votes():
    votes = get_all_votes()
    if votes is not None:
        return {"votes": votes}
    raise HTTPException(status_code=500, detail="Error fetching votes")