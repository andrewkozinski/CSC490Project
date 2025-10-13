from fastapi import APIRouter, HTTPException
from database.vote import add_vote, delete_vote, increment_upvote, decrement_upvote, increment_downvote, \
    decrement_downvote, get_vote_id_by_review_and_comment_id

router = APIRouter()

#Initializes votes for a review
@router.post("/initialize_votes/{review_id}")
async def initialize_votes(review_id: int):
    result = add_vote(review_id, None, 0, 0)
    if result is False:
        raise HTTPException(status_code=500, detail="Error initializing votes for review")
    return {"message": "Votes initialized successfully"}

#Initialize votes for a comment
@router.post("/initialize_votes/{review_id}/{comment_id}")
async def initialize_votes_for_comment(review_id: int, comment_id: int):
    result = add_vote(review_id, comment_id, 0, 0)
    if result is False:
        raise HTTPException(status_code=500, detail="Error initializing votes for comment")
    return {"message": "Votes initialized successfully"}

#Increments upvote count for a review or comment
@router.put("/upvote/{review_id}")
async def upvote(review_id: int, comment_id: int = None):
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

#Decrements upvote count for a review or comment
@router.put("/remove_upvote/{review_id}")
async def remove_upvote(review_id: int, comment_id: int = None):
    vote_id = get_vote_id_by_review_and_comment_id(review_id, comment_id) # Get the vote ID
    if vote_id is None:
        raise HTTPException(status_code=404, detail="Vote record not found")
    result = decrement_upvote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error removing upvote")
    return {"message": "Upvote removed successfully, upvote count decremented"}

#Increments downvote count for a review or comment
@router.put("/downvote/{review_id}")
async def downvote(review_id: int, comment_id: int = None):
    vote_id = get_vote_id_by_review_and_comment_id(review_id, comment_id) # Get the vote ID
    if vote_id is None:
        # If no vote record exists, initialize it
        init_result = add_vote(review_id, comment_id, 0, 1)
        if init_result is False:
            raise HTTPException(status_code=500, detail="Error initializing votes")
        return {"message": "Downvoted successfully, votes initialized with value of 1"}
    result = increment_downvote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error downvoting")
    return {"message": "Downvoted successfully, downvote count incremented"}

#Decrements downvote count for a review or comment
@router.put("/remove_downvote/{review_id}")
async def remove_downvote(review_id: int, comment_id: int = None):
    vote_id = get_vote_id_by_review_and_comment_id(review_id, comment_id) # Get the vote ID
    if vote_id is None:
        raise HTTPException(status_code=404, detail="Vote record not found")
    result = decrement_downvote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error removing downvote")
    return {"message": "Downvote removed successfully, downvote count decremented"}

#Deletes vote record for a review or comment
#Not sure why we'd need this one but why not
@router.delete("/delete/{review_id}")
async def delete_votes(review_id: int, comment_id: int = None):
    vote_id = get_vote_id_by_review_and_comment_id(review_id, comment_id) # Get the vote ID
    if vote_id is None:
        raise HTTPException(status_code=404, detail="Vote record not found")
    result = delete_vote(vote_id)
    if result is False:
        raise HTTPException(status_code=500, detail="Error deleting votes")
    return {"message": "Votes deleted successfully"}

