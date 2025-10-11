from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.comments import add_comment

class ReviewComment(BaseModel):
    review_id: int
    user_id: int
    comment_text: str

class DeleteCommentRequest(BaseModel):
    comment_id: int

router = APIRouter()

#Need routes to post, get, update, delete comments
@router.post("/create")
async def create_comment(comment: ReviewComment):
    print("COMMENT REQUEST:")
    print(comment.review_id)
    print(comment.user_id)
    print(comment.comment_text)

    comm_id = add_comment(
        review_id=comment.review_id,
        user_id=comment.user_id,
        comm_text=comment.comment_text
    )
    if comm_id is not None:
        return {"message": "Comment created successfully", "comm_id": comm_id}
    else:
        HTTPException(status_code=500, detail="Failed to create comment. Please try again.")