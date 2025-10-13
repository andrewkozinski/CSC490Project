from fastapi import APIRouter, HTTPException
from database.vote import add_vote, delete_vote, increment_upvote, decrement_upvote, increment_downvote, decrement_downvote

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


