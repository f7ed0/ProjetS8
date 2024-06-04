# controllers/historicController.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from models.historic import Historic as HistoricModel
from models.historicModel import HistoricBase, HistoricCreate, HistoricUpdate
from config import get_db

router = APIRouter()

@router.get("/historic", response_model=List[HistoricBase])
def get_all_historic(db: Session = Depends(get_db)):
    historic_list = db.query(HistoricModel).all()
    return historic_list

@router.get("/historic/distinct", response_model=List[HistoricBase])
def get_all_distinct_historic(db: Session = Depends(get_db)):
    subquery = db.query(
        HistoricModel.chat_id,
        func.min(HistoricModel.id).label('min_id')
    ).group_by(HistoricModel.chat_id).subquery()
    
    historic_list = db.query(HistoricModel).join(
        subquery, HistoricModel.id == subquery.c.min_id
    ).all()
    return historic_list

@router.get("/historic/{id}", response_model=HistoricBase)
def get_historic_by_id(id: int, db: Session = Depends(get_db)):
    historic_item = db.query(HistoricModel).filter(HistoricModel.id == id).first()
    if historic_item is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    return historic_item

@router.get("/historic/chat/{chat_id}", response_model=List[HistoricBase])
def get_historic_by_chat_id(chat_id: int, db: Session = Depends(get_db)):
    historic_item = db.query(HistoricModel).filter(HistoricModel.chat_id == chat_id)
    if historic_item is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    return historic_item

@router.get("/historic/chat/unique/{chat_id}", response_model=List[HistoricBase])
def get_historic_by_chat_id_unique(chat_id: int, db: Session = Depends(get_db)):
    historic_item = db.query(HistoricModel).filter(HistoricModel.chat_id == chat_id).last()
    if historic_item is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    return historic_item

@router.post("/historic", response_model=HistoricBase)
def create_historic(historic: HistoricCreate, db: Session = Depends(get_db)):
    db_historic = HistoricModel(**historic.dict())
    print(db_historic)
    db.add(db_historic)
    db.commit()
    db.refresh(db_historic)
    return db_historic

@router.put("/historic/chat/{id}", response_model=HistoricBase)
def update_historic(id: int, historic: HistoricUpdate, db: Session = Depends(get_db)):
    db_historic = db.query(HistoricModel).filter(HistoricModel.chat_id == id).last()
    if db_historic is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    db_historic.chat_ia = historic.chat_ia
    db.commit()
    db.refresh(db_historic)
    return db_historic

@router.delete("/historic/{id}")
def delete_historic(id: int, db: Session = Depends(get_db)):
    historic_item = db.query(HistoricModel).filter(HistoricModel.id == id).first()
    if historic_item is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    db.delete(historic_item)
    db.commit()
    return {"detail": "Historic deleted"}
