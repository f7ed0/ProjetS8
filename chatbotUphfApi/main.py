from fastapi import FastAPI
from controllers.historicController import historic_router

app = FastAPI()

# Enregistrer le module de routage auprès de l'instance FastAPI
app.include_router(historic_router)
