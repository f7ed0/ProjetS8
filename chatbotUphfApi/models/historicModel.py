# schemas.py
from datetime import datetime
from pydantic import BaseModel, Field

class HistoricBase(BaseModel)

class Historic(HistoricBase):
    id: str


class ListHistoricBase(BaseModel):
    chat : list[HistoricBase]

class HistoricCreate(HistoricBase):
    chat_id: str
    chat_id_user : str
    chat_user: str
    chat_ia: str
    timestamp: datetime = Field(default_factory=datetime.now)

class HistoricUpdate(HistoricBase):
    chat_ia: str

