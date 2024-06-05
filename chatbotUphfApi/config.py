from pymongo import MongoClient

MONGO_URI = "mongodb://root:insa@localhost:27017/?authSource=chatbotUPHF"
DATABASE_NAME = "chatbotUPHF"

DATABASE_URL = "mysql+pymysql://root:insa@localhost:3307/chatbotUPHF"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    return db




