from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
Base = declarative_base()
# Supprimer toutes les tables
Base.metadata.drop_all(engine)

class historic(Base):
    __tablename__ = 'historic'
    id = Column(Integer, primary_key=True)
    chat_id = Column(String)
    chat_user = Column(String)
    chat_ia= Column(String)

Base.metadata.create_all(engine)
