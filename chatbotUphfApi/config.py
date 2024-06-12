from pymongo import MongoClient

MONGO_URI = "mongodb://root:insa@localhost:27017/?authSource=chatbotUPHF"
DATABASE_NAME = "chatbotUPHF"

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
users_collection = db['users']
if 'feedback' not in db.list_collection_names():
    db.create_collection('feedback')
else:
    feedback_collection = db['feedback']

def get_db():
    return db




