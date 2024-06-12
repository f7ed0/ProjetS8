from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
Base = declarative_base()
# Supprimer toutes les tables
Base.metadata.drop_all(engine)

class Historic(Base):
    __tablename__ = 'historic'
    id = Column(Integer, primary_key=True)
    chat_id = Column(String(255))
    chat_user = Column(String(255))
    chat_ia= Column(String(255))

Base.metadata.create_all(engine)
