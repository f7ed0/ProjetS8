# chatbotUphfApi/seed/insert.py

from sqlalchemy.orm import Session
from models.historic import Historic
from config import SessionLocal

def insert_historic():
    db = SessionLocal()
    db.add(Historic(chat_id="1", chat_user="Bonjour", chat_ia="Bonjour"))
    db.add(Historic(chat_id="1", chat_user="Comment ça va ?", chat_ia="Je vais bien et vous ?"))
    db.add(Historic(chat_id="1", chat_user="Je vais bien merci", chat_ia="Je suis content pour vous"))
    db.add(Historic(chat_id="1", chat_user="Merci", chat_ia="Je vous en prie"))
    db.add(Historic(chat_id="1", chat_user="Au revoir", chat_ia="Au revoir"))
    db.add(Historic(chat_id="1", chat_user="A bientôt", chat_ia="A bientôt"))
    db.add(Historic(chat_id="2", chat_user="Salut", chat_ia="Salut"))
    db.add(Historic(chat_id="2", chat_user="Comment ça va ?", chat_ia="Je vais bien et vous ?"))
    db.add(Historic(chat_id="2", chat_user="Je vais bien merci", chat_ia="Je suis content pour vous"))
    db.add(Historic(chat_id="2", chat_user="Merci", chat_ia="Je vous en prie"))
    db.commit()
    db.close()

if __name__ == "__main__":
    insert_historic()
