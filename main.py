from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from chatbotUphfApi.controllers.historicController import router as historic_router
from chatbotUphfApi.controllers.userController import router as user_router
from chatbotUphfApi.controllers.feedbackController import router as feedback_router
import IA.ai 

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:4200/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/api/v1")
app.include_router(historic_router, prefix="/api/v1")
app.include_router(feedback_router, prefix="/api/v1")


IA.ai.init()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
    


  
