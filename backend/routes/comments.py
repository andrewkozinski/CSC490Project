from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.comments import add_comment, delete_comment, get_all_comments

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
        comm_text=comment.comment_text,
        parent_comm_id=None
    )
    if comm_id is not None:
        return {"message": "Comment created successfully", "comm_id": comm_id}
    else:
        HTTPException(status_code=500, detail="Failed to create comment. Please try again.")

@router.delete("/delete/")
async def delete_comment(comment: DeleteCommentRequest):
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