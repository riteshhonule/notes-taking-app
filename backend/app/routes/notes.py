from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Note, User
from app.schemas import NoteCreate, NoteResponse, NoteUpdate
from app.auth import get_current_user, extract_token_from_header

router = APIRouter(prefix='/notes', tags=['notes'])

@router.get('', response_model=dict)
def get_all_notes(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Missing authorization header',
        )

    token = extract_token_from_header(authorization)
    user = get_current_user(token, db)

    notes = db.query(Note).filter(Note.user_id == user.id).order_by(Note.last_update.desc()).all()
    return {'notes': [NoteResponse.from_orm(note) for note in notes]}

@router.get('/{note_id}', response_model=NoteResponse)
def get_note(note_id: str, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Missing authorization header',
        )

    token = extract_token_from_header(authorization)
    user = get_current_user(token, db)

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Note not found',
        )

    return NoteResponse.from_orm(note)

@router.post('', response_model=NoteResponse)
def create_note(
    note_data: NoteCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Missing authorization header',
        )

    token = extract_token_from_header(authorization)
    user = get_current_user(token, db)

    db_note = Note(
        note_title=note_data.note_title,
        note_content=note_data.note_content,
        user_id=user.id,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    return NoteResponse.from_orm(db_note)

@router.put('/{note_id}', response_model=NoteResponse)
def update_note(
    note_id: str,
    note_data: NoteUpdate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Missing authorization header',
        )

    token = extract_token_from_header(authorization)
    user = get_current_user(token, db)

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Note not found',
        )

    note.note_title = note_data.note_title
    note.note_content = note_data.note_content
    db.commit()
    db.refresh(note)

    return NoteResponse.from_orm(note)

@router.delete('/{note_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: str, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Missing authorization header',
        )

    token = extract_token_from_header(authorization)
    user = get_current_user(token, db)

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Note not found',
        )

    db.delete(note)
    db.commit()

    return None
