# schemas.py
from pydantic import BaseModel

class HistoricBase(BaseModel):
    chat_id: str
    chat_id_user : str
    chat_user: str
    chat_ia: str

class ListHistoricBase(BaseModel):
    chat : list[HistoricBase]
class HistoricCreate(HistoricBase):
    chat_id: str
    chat_id_user : str
    chat_user: str
    chat_ia: str



class HistoricUpdate(HistoricBase):
    chat_ia: str

class Historic(HistoricBase):
    id: int

    class Config:
        orm_mode = True

