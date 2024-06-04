# schemas.py
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel

class HistoricBase(BaseModel):
    chat_id: str
    chat_user: str
    chat_ia: str

class HistoricCreate(HistoricBase):
    pass

class HistoricUpdate(HistoricBase):
    pass

class Historic(HistoricBase):
    id: int

    class Config:
        orm_mode = True
