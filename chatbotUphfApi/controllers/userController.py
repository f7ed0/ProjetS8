# routes.py
from fastapi import APIRouter, Depends, HTTPException
from models.userModel import UserModel, ChatModel
from config import get_db
from pymongo.collection import Collection
from typing import List

router = APIRouter()

@router.post("/register")
async def register(user: UserModel, db=Depends(get_db)):
    users_collection: Collection = db['users']
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    users_collection.insert_one(user.dict())
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user: UserModel, db=Depends(get_db)):
    users_collection: Collection = db['users']
    db_user = users_collection.find_one({"username": user.username, "password": user.password})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    else:
        user_id = str(db_user['_id'])
        print(user_id)
    return {"message": "Login successfuleeje", "user_id": user_id}


