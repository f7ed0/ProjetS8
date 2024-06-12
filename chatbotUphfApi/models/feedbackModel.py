from pydantic import BaseModel, Field

class FeedbackBase(BaseModel):
    chat_id: str
    chat_id_user: str
    chat_ia: str
    id : str
    feedback: str
    is_suggestion: bool
    is_like: bool

class Feedback(FeedbackBase):
    id: str = Field(alias="_id")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
