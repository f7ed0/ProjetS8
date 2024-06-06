from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.historicController import router as historic_router
from controllers.userController import router as user_router

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

app.include_router(user_router, prefix="/api/v1")
app.include_router(historic_router, prefix="/api/v1")





if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


  
