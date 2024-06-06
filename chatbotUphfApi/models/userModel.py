from pydantic import BaseModel, Field
from typing import List, Optional

class UserModel(BaseModel):
    username: str
    password: str

class ChatModel(BaseModel):
    chat_id: str
    messages: Optional[List[str]] = Field(default_factory=list)