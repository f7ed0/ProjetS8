from fastapi import APIRouter, Depends, HTTPException
from typing import List
from chatbotUphfApi.models.feedbackModel import FeedbackBase, Feedback
from chatbotUphfApi.config import get_db
from bson import ObjectId
from chatbotUphfApi.controllers.security import oauth2_scheme, decode_access_token

router = APIRouter()

@router.post("/feedback", response_model=Feedback)
def create_feedback(feedback: FeedbackBase, db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    decode_access_token(token)
    feedback_dict = feedback.dict(by_alias=True)
    result = db.feedback.insert_one(feedback_dict)
    feedback_dict["_id"] = str(result.inserted_id)
    return feedback_dict


@router.get("/getfeedback", response_model=List[Feedback])
def read_feedbacks(db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    decode_access_token(token)
    feedbacks = list(db.feedback.find())
    for feedback in feedbacks:
        feedback["_id"] = str(feedback["_id"])
    return feedbacks

@router.get("/feedback/{chat_id}", response_model=Feedback)
def read_feedback(chat_id: str, db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    decode_access_token(token)
    feedback = db.feedback.find_one({"id": chat_id})
    if feedback:
        feedback["_id"] = str(feedback["_id"])
    return feedback

@router.put("/feedback/{feedback_id}", response_model=Feedback)
def update_feedback(feedback_id: str, feedback: FeedbackBase, db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    decode_access_token(token)
    feedback_dict = feedback.dict(by_alias=True)
    db.feedback.update_one({"id": feedback_id}, {"$set": feedback_dict})
    feedback_dict["_id"] = feedback_id
    return feedback_dict

@router.get("/feedback/like", response_model=Feedback)
def like_feedback(db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    decode_access_token(token)
    feedback = db.feedback.find_one({"like": True})
    if feedback:
        feedback["_id"] = str(feedback["_id"])
    return feedback

@router.get("/feedback/dislike", response_model=Feedback)
def dislike_feedback(db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    decode_access_token(token)
    feedback = db.feedback.find_one({"like": False})
    if feedback:
        feedback["_id"] = str(feedback["_id"])
    return feedback

@router.get("/feedback/suggestion", response_model=Feedback)
def suggestion_feedback(db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    decode_access_token(token)
    feedback = db.feedback.find_one({"suggestion": True})
    if feedback:
        feedback["_id"] = str(feedback["_id"])
    return feedback
