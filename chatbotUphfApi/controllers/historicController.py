#fais moi le controller de l'historique on utilise fastAPI,mysql et sqlalchemy
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from typing import List
from models.historicModel import historic


router = APIRouter()

@router.get("/historic", response_model=List[historic])
def get_all_historic(db: Session = Depends(get_db)):
    historic_list = db.query(historic).all()
    return historic_list

@router.get("/historic/{id}", response_model=historic)
def get_historic_by_id(id: int, db: Session = Depends(get_db)):
    historic_list = db.query(historic).filter(historic.id == id).first()
    if historic_list is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    return historic_list

@router.post("/historic", response_model=historic)
def create_historic(historic: historic, db: Session = Depends(get_db)):
    db.add(historic)
    db.commit()
    db.refresh(historic)
    return historic

@router.put("/historic/{id}", response_model=historic)
def update_historic(id: int, historic: historic, db: Session = Depends(get_db)):
    historic_list = db.query(historic).filter(historic.id == id).first()
    if historic_list is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    historic_list.chat_id = historic.chat_id
    historic_list.chat_user = historic.chat_user
    historic_list.chat_ia = historic.chat_ia
    db.commit()
    db.refresh(historic_list)
    return historic_list

@router.delete("/historic/{id}")
def delete_historic(id: int, db: Session = Depends(get_db)):
    historic_list = db.query(historic).filter(historic.id == id).first()
    if historic_list is None:
        raise HTTPException(status_code=404, detail="Historic not found")
    db.delete(historic_list)
    db.commit()
    return {"Historic deleted"}



