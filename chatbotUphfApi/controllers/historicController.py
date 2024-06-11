from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.historicModel import HistoricBase, HistoricCreate, HistoricUpdate, Historic
from config import get_db
from bson import ObjectId

router = APIRouter()


@router.get("/historic", response_model=List[Historic])
def get_all_historic(db = Depends(get_db)):
    historic_list = list(db.historic.find())
    for item in historic_list:
        item['id'] = str(item['_id'])
    return historic_list

@router.get("/historic/distinct", response_model=List[Historic])
def get_all_distinct_historic(db = Depends(get_db)):
    pipeline = [
        {"$group": {"_id": "$chat_id", "doc": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$doc"}}
    ]
    historic_list = list(db.historic.aggregate(pipeline))
    for item in historic_list:
        item['id'] = str(item['_id'])
    return historic_list

@router.get("/historic/distinct/{chat_id_user}", response_model=List[Historic])
def get_all_distinct_historic_by_user_id(chat_id_user: str, db = Depends(get_db)):
    pipeline = [
        {"$match": {"chat_id_user": chat_id_user}},
        {"$group": {"_id": "$chat_id", "doc": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$doc"}}
    ]
    historic_list = list(db.historic.aggregate(pipeline))
    for item in historic_list:
        item['id'] = str(item['_id'])
    return historic_list

@router.get("/historic/user/{user_id}", response_model=List[Historic])
def get_historic_by_user_id(user_id: str, db = Depends(get_db)):
    pipeline = [
        {"$match": {"chat_id_user": user_id}},  
        {"$group": {"_id": "$chat_id", "doc": {"$first": "$$ROOT"}}},  
        {"$replaceRoot": {"newRoot": "$doc"}} 
    ]
    historic_item = list(db.historic.aggregate(pipeline))
    if not historic_item:
        raise HTTPException(status_code=404, detail="Historic not found")
    
    for item in historic_item:
        item['id'] = str(item['_id']) 
    return historic_item


@router.get("/historic/chat/{chat_id}", response_model=List[Historic])
def get_historic_by_chat_id(chat_id: str, db = Depends(get_db)):
    historic_items = list(db.historic.find({"chat_id": chat_id}))
    if not historic_items:
        raise HTTPException(status_code=404, detail="Historic not found")
    for item in historic_items:
        item['id'] = str(item['_id'])
    return historic_items

@router.get("/historic/chat/user/{id}", response_model=List[Historic])
def get_historic_chat_by_id(id: str, db = Depends(get_db)):
    historic_items = list(db.historic.find({"chat_id_user": id}))
    print(historic_items)
    if not historic_items:
        raise HTTPException(status_code=404, detail="Historic not found")
    for item in historic_items:
        item['id'] = str(item['_id'])
    return historic_items


@router.get("/historic/chat/unique/{chat_id}", response_model=Historic)
def get_historic_by_chat_id_unique(chat_id: str, db = Depends(get_db)):
    # Rechercher le dernier élément par chat_id en triant par timestamp descendant
    historic_item = get_historic_by_chat_id(chat_id, db)
    if not historic_item:
        raise HTTPException(status_code=404, detail="Historic not found")
    return historic_item[-1]

@router.post("/historic", response_model=HistoricBase)
def create_historic(historic: HistoricCreate, db = Depends(get_db)):
    result = db.historic.insert_one(historic.dict())
    new_historic = db.historic.find_one({"_id": result.inserted_id})
    new_historic['id'] = str(new_historic['_id'])
    return new_historic


@router.put("/historic/{id}", response_model=HistoricBase)
def update_historic(id: str, historic: HistoricUpdate, db = Depends(get_db)):
    updated_data = {k: v for k, v in historic.dict().items() if v is not None}
    result = db.historic.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Historic not found")
    updated_historic = db.historic.find_one({"_id": ObjectId(id)})
    updated_historic['id'] = str(updated_historic['_id'])
    return updated_historic

@router.delete("/historic/{id}")
def delete_historic(id: str, db=Depends(get_db)):
    result = db.historic.delete_many({"chat_id_user": id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Historic not found")
    return {"message": f"{result.deleted_count} historic records deleted successfully"}



