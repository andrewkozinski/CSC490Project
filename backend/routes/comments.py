from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.comments import add_comment, delete_comment, get_all_comments, get_comments_by_review_id, get_comments_by_parent_comm_id
from database import vote
from routes.profiles import get_username_by_id
from routes.auth import verify_jwt_token, get_user_id_from_token

class ReviewComment(BaseModel):
    review_id: int
    comment_text: str
    jwt_token: str # JWT token for authentication
    parent_comm_id: int | None # Optional, for replies to comments

class DeleteCommentRequest(BaseModel):
    comment_id: int
    jwt_token: str

router = APIRouter()

#Need routes to post, get, update, delete comments
@router.post("/create")
async def create_comment(comment: ReviewComment):
    #Need to validate the JWT token here before allowing the user to create a comment
    verify_jwt_token(comment.jwt_token)

    #Get user id from the JWT token
    jwt_id = get_user_id_from_token(comment.jwt_token)

    print("COMMENT REQUEST:")
    print("JWT ID:", jwt_id)
    print("Review ID:", comment.review_id)
    print("Comment Text:", comment.comment_text)

    comm_id = add_comment(
        review_id=comment.review_id,
        user_id=jwt_id,
        comm_text=comment.comment_text,
        parent_comm_id=None
    )
    if comm_id is not None:

        #Also initialize votes for the comment
        vote_result = vote.add_vote(None, comm_id, 0, 0)

        return {"message": "Comment created successfully", "comm_id": comm_id}
    else:
        HTTPException(status_code=500, detail="Failed to create comment. Please try again.")

@router.delete("/delete/")
async def delete_comment(comment: DeleteCommentRequest):

    verify_jwt_token(comment.jwt_token)

    #Delete votes associated with the comment
    vote_id = vote.get_vote_id_by_review_and_comment_id(None, comment.comment_id)
    if vote_id is not None:
        vote.delete_vote(vote_id)

    result = delete_comment(comment.comment_id)

    if result is False:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}

@router.get("/all")
async def fetch_all_comments():
    comments = get_all_comments()
    if comments is not None:
        return {"comments": comments}
    raise HTTPException(status_code=500, detail="Error fetching comments")

@router.get("/from_review/{review_id}")
async def fetch_comments_for_review(review_id: int):
    comments = get_comments_by_review_id(review_id)
    if comments is not None:

        #For each comment, add a username field by looking up the user id
        for comment in comments:
            user_id = comment["user_id"]
            print(user_id)
            if user_id:
               username = await get_username_by_id(user_id)
               comment["username"] = username if username else "Unknown"
            else:
                comment["username"] = "Unknown"

        return {"comments": comments}
    else:
        return {"comments": []}

@router.get("/from_comment/{parent_comm_id}")
async def fetch_replies_to_comment(parent_comm_id: int):
    comments = get_comments_by_parent_comm_id(parent_comm_id)
    if comments is not None:
        #For each comment, add a username field by looking up the user id
        for comment in comments:
            user_id = comment["user_id"]
            print(user_id)
            if user_id:
               username = await get_username_by_id(user_id)
               comment["username"] = username if username else "Unknown"
            else:
                comment["username"] = "Unknown"

        return {"comments": comments}
    else:
        return {"comments": []}


@router.post("/comments/initialize_votes_for_all_comments")
async def initialize_votes_for_all_comments():
    comments = get_all_comments()
    if comments is None:
        raise HTTPException(status_code=500, detail="Error fetching comments")

    for comment in comments:
        comm_id = comment["comm_id"]
        review_id = comment["review_id"]
        # Check if votes already exist for this comment
        vote_id = vote.get_vote_id_by_review_and_comment_id(review_id, comm_id)
        if vote_id is None:
            result = vote.add_vote(None, comm_id, 0, 0)
            if result is False:
                print(f"Error initializing votes for comment ID {comm_id}")
    return {"message": "Vote initialization process completed"}