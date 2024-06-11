# routes.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from models.userModel import UserModel, Token
from config import get_db
from pymongo.collection import Collection, ObjectId,Optional
from typing import List
from datetime import timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta



router = APIRouter()
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class TokenData:
    username: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise JWTError()
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    

@router.post("/register", response_model=Token)
async def register(user: UserModel, db=Depends(get_db)):
    users_collection: Collection = db['users']
    db_user = users_collection.find_one({"username": user.username})
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password
    users_collection.insert_one(user_data)
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(user: UserModel, db=Depends(get_db)):
    users_collection: Collection = db['users']
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.delete("/delete/{user_id}")
async def delete_user(user_id: str, db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    users_collection: Collection = db['users']
    username = decode_access_token(token)
    
    db_user = users_collection.find_one({"username": username})
    if not db_user or str(db_user['_id']) != user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    users_collection.delete_one({"_id": ObjectId(user_id)})
    return {"message": "User deleted successfully"}


# @router.post("/register")
# async def register(user: UserModel, db=Depends(get_db)):
#     users_collection: Collection = db['users']
#     db_user = users_collection.find_one({"username": user.username})
#     if db_user:
#         raise HTTPException(status_code=400, detail="Username already registered")
#     else:
#         users_collection.insert_one(user.dict())
#         db_user = users_collection.find_one({"username": user.username})
#         user_id = str(db_user['_id'])
#         print(user_id)
#     return {"message": "User registered successfully", "user_id": user_id}


# @router.post("/login")
# async def login(user: UserModel, db=Depends(get_db)):
#     users_collection: Collection = db['users']
#     db_user = users_collection.find_one({"username": user.username, "password": user.password})
#     if not db_user:
#         raise HTTPException(status_code=401, detail="Invalid username or password")
#     else:
#         user_id = str(db_user['_id'])
#         print(user_id)
#     return {"message": "Login successfuleeje", "user_id": user_id}


# @router.delete("/delete/{user_id}")
# async def delete_user(user_id: str, db=Depends(get_db)):
#     users_collection: Collection = db['users']
#     if not users_collection.find({"_id": ObjectId(user_id)}):
#         raise HTTPException(status_code=404, detail="User not found")
#     users_collection.delete_one({"_id": ObjectId(user_id)})
#     return {"message": "User deleted successfully"}



