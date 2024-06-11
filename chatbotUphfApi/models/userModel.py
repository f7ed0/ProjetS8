from pydantic import BaseModel, Field
from typing import List, Optional

class UserModel(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = None