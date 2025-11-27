from fastapi import APIRouter, Depends, HTTPException, status, Header
from datetime import timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, Token, UserResponse
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    extract_token_from_header,
)
from app.config import get_settings

router = APIRouter(prefix='/auth', tags=['auth'])
settings = get_settings()

@router.post('/signup', response_model=Token)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.user_email == user_data.user_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Email already registered',
        )

    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        user_name=user_data.user_name,
        user_email=user_data.user_email,
        password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={'sub': db_user.id}, expires_delta=access_token_expires
    )

    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user': UserResponse.from_orm(db_user),
    }

@router.post('/signin', response_model=Token)
def signin(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_email == user_data.user_email).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid email or password',
        )

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={'sub': user.id}, expires_delta=access_token_expires
    )

    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user': UserResponse.from_orm(user),
    }

@router.get('/me', response_model=UserResponse)
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Missing authorization header',
        )

    token = extract_token_from_header(authorization)
    user = get_current_user(token, db)
    return UserResponse.from_orm(user)
