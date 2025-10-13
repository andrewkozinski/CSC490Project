from fastapi import APIRouter, HTTPException
from database.vote import add_vote, delete_vote, increment_upvote, decrement_upvote, increment_downvote, \
    decrement_downvote, get_vote_id_by_review_and_comment_id

router = APIRouter

#Initializes votes for a review
@router.add("/initialize_votes/{review_id}")
def initialize_votes(review_id: int):
    result = add_vote(review_id, None, 0, 0)
    if result is False:
        raise HTTPException(status_code=500, detail="Error initializing votes for review")
    return {"message": "Votes initialized successfully"}

#Initialize votes for a comment
@router.add("initialize_votes/{review_id}/{comment_id}")
def initialize_votes_for_comment(review_id: int, comment_id: int):
    result = add_vote(review_id, comment_id, 0, 0)
    if result is False:
        raise HTTPException(status_code=500, detail="Error initializing votes for comment")
    return {"message": "Votes initialized successfully"}

#Increments upvote count for a review or comment
@router.put("/upvote/{review_id}")
def upvote(review_id: int, comment_id: int = None):
    vote_id = get_vote_id_by_review_and_comment_id(review_id, comment_id) # Get the vote ID
    if vote_id is None:
        # If no vote record exists, initialize it
        init_result = add_vote(review_id, comment_id, 1, 0)
        if init_result is False:
            raise HTTPException(status_code=500, detail="Error initializing votes")
        return {"message": "Upvoted successfully, votes initialized with value of 1"}
    result = increment_upvote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error upvoting")
    return {"message": "Upvoted successfully, upvote count incremented"}