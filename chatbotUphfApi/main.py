# main.py
from fastapi import FastAPI
from controllers.historicController import router as historic_router

app = FastAPI()

# Enregistrer le module de routage auprès de l'instance FastAPI
app.include_router(historic_router, prefix="/api/v1", tags=["historics"])
