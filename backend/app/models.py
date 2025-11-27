from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_name = Column(String(255), nullable=False)
    user_email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    last_update = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    notes = relationship('Note', back_populates='owner', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.user_email}>'


class Note(Base):
    __tablename__ = 'notes'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    note_title = Column(String(255), nullable=False)
    note_content = Column(Text, nullable=False)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    last_update = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False, index=True)

    owner = relationship('User', back_populates='notes')

    def __repr__(self):
        return f'<Note {self.note_title}>'
