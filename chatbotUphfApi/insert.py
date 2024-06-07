# chatbotUphfApi/seed/insert.py

from config import get_db

def insert_historic():
    db = get_db()
    db.historic.drop()
    db.historic.insert_many([
        {"chat_id": "1", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Bonjour", "chat_ia": "Bonjour"},
        {"chat_id": "1", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Comment ça va ?", "chat_ia": "Je vais bien et vous ?"},
        {"chat_id": "1", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Je vais bien merci", "chat_ia": "Je suis content pour vous"},
        {"chat_id": "1", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Merci", "chat_ia": "Je vous en prie"},
        {"chat_id": "1", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Au revoir", "chat_ia": "Au revoir"},
        {"chat_id": "1", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "A bientôt", "chat_ia": "A bientôt"},
        {"chat_id": "1", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "chat perso ?", "chat_ia": "Bien sur mon reuf"},
        {"chat_id": "2", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Salut", "chat_ia": "Salut"},
        {"chat_id": "2", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Comment ça va ?", "chat_ia": "Je vais bien et vous ?"},
        {"chat_id": "2", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Je vais bien merci", "chat_ia": "Je suis content pour vous"},
        {"chat_id": "2", "chat_id_user" : "66610b1b63021700955c2a3b", "chat_user": "Merci", "chat_ia": "Je vous en prie"}
    ])
    print("Data inserted successfully")

if __name__ == "__main__":
    insert_historic()