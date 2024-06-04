# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.historicController import router as historic_router

app = FastAPI()

origins = [
    "http://localhost:4200",  # Your Angular app's URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Enregistrer le module de routage auprès de l'instance FastAPI
app.include_router(historic_router, prefix="/api/v1", tags=["historics"])
  
