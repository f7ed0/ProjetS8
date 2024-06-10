from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.feedbackModel import FeedbackBase, Feedback
from config import get_db
from bson import ObjectId

router = APIRouter()

@router.post("/feedback", response_model=Feedback)
def create_feedback(feedback: FeedbackBase, db=Depends(get_db)):
    feedback_dict = feedback.dict(by_alias=True)
    result = db.feedback.insert_one(feedback_dict)
    feedback_dict["_id"] = str(result.inserted_id)
    return feedback_dict


@router.get("/getfeedback", response_model=List[Feedback])
def read_feedbacks(db=Depends(get_db)):
    feedbacks = list(db.feedback.find())
    for feedback in feedbacks:
        feedback["_id"] = str(feedback["_id"])
    return feedbacks

@router.get("/feedback/{chat_id}", response_model=Feedback)
def read_feedback(chat_id: str, db=Depends(get_db)):
    feedback = db.feedback.find_one({"id": chat_id})
    if feedback:
        feedback["_id"] = str(feedback["_id"])
    return feedback

@router.put("/feedback/{feedback_id}", response_model=Feedback)
def update_feedback(feedback_id: str, feedback: FeedbackBase, db=Depends(get_db)):
    feedback_dict = feedback.dict(by_alias=True)
    db.feedback.update_one({"id": feedback_id}, {"$set": feedback_dict})
    feedback_dict["_id"] = feedback_id
    return feedback_dict