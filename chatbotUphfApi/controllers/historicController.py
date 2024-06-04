# controllers/historicController.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.historic import historic as HistoricModel
from models.historicModel import Historic, HistoricCreate, HistoricUpdate
from config import get_db

router = APIRouter()

@router.get("/historic", response_model=List[Historic])
def get_all_historic(db: Session = Depends(get_db)):
    historic_list = db.query(HistoricModel).all()
    return historic_list

@router.get("/historic/{id}", response_model=Historic)
def get_historic_by_id(id: int, db: Session = Depends(get_db)):
    historic_item = db.query(HistoricModel).filter(HistoricModel.id == id).first()
    if historic_item is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    return historic_item

@router.post("/historic", response_model=Historic)
def create_historic(historic: HistoricCreate, db: Session = Depends(get_db)):
    db_historic = HistoricModel(**historic.dict())
    db.add(db_historic)
    db.commit()
    db.refresh(db_historic)
    return db_historic

@router.put("/historic/{id}", response_model=Historic)
def update_historic(id: int, historic: HistoricUpdate, db: Session = Depends(get_db)):
    historic_item = db.query(HistoricModel).filter(HistoricModel.id == id).first()
    if historic_item is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    for key, value in historic.dict().items():
        setattr(historic_item, key, value)
    db.commit()
    db.refresh(historic_item)
    return historic_item

@router.delete("/historic/{id}")
def delete_historic(id: int, db: Session = Depends(get_db)):
    historic_item = db.query(HistoricModel).filter(HistoricModel.id == id).first()
    if historic_item is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    db.delete(historic_item)
    db.commit()
    return {"detail": "Historic deleted"}
