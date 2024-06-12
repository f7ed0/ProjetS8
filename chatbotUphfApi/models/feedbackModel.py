from pydantic import BaseModel, Field

class FeedbackBase(BaseModel):
is

class Feedback(FeedbackBase):
    id: str = Field(alias="_id")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
