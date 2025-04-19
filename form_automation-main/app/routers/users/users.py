# FastAPI Imports
from fastapi import APIRouter, Depends, HTTPException, status, Query


# Database Imports
from sqlalchemy.orm import Session
from database.database import get_db
from database.tables.table_users import Users

# User Services
from . import schemas

from typing import List


router = APIRouter(tags=['Users Module'], prefix='/users')


@router.get("/healthcheck", status_code=status.HTTP_200_OK)
def healthcheck():
    """
    Healthcheck endpoint for the users module.
    """
    return {"status": "ok"}



# Create User - Student
@router.post("/student", response_model=schemas.CompleteStudentDetails, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.StudentCreate, db: Session = Depends(get_db)):
    existing_student = db.query(Users).filter(Users.id == user.id).first()

    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student with this ID already exists."
        )
    
    new_student = Users(**user.dict())

    db.add(new_student)
    db.commit()

    return new_student


# Create User - Admin
@router.post("/admin", response_model=schemas.CompleteAdminDetails, status_code=status.HTTP_201_CREATED)
def create_admin(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    existing_admin = db.query(Users).filter(Users.id == admin.id).first()

    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin with this ID already exists."
        )
    
    new_admin = Users(**admin.dict())

    db.add(new_admin)
    db.commit()

    return new_admin


# Update User - Student
@router.put("/student/{user_id}", response_model=schemas.CompleteStudentDetails, status_code=status.HTTP_200_OK)
def update_student(user_id: str, user: schemas.StudentCreate, db: Session = Depends(get_db)):
    existing_student = db.query(Users).filter(Users.id == user_id).first()

    if not existing_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found."
        )
    
    for key, value in user.dict().items():
        setattr(existing_student, key, value)

    db.commit()

    return existing_student


# Update User - Admin
@router.put("/admin/{user_id}", response_model=schemas.CompleteAdminDetails, status_code=status.HTTP_200_OK)
def update_admin(user_id: str, admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    existing_admin = db.query(Users).filter(Users.id == user_id).first()

    if not existing_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found."
        )
    
    for key, value in admin.dict().items():
        setattr(existing_admin, key, value)

    db.commit()

    return existing_admin


# Get User - Student
@router.get("/student/{user_id}", response_model=schemas.CompleteStudentDetails, status_code=status.HTTP_200_OK)
def get_student(user_id: str, db: Session = Depends(get_db)):
    existing_student = db.query(Users).filter(Users.id == user_id).first()

    if not existing_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found."
        )

    return existing_student


# Get User - Admin
@router.get("/admin/{user_id}", response_model=schemas.CompleteAdminDetails, status_code=status.HTTP_200_OK)
def get_admin(user_id: str, db: Session = Depends(get_db)):
    existing_admin = db.query(Users).filter(Users.id == user_id).first()

    if not existing_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found."
        )

    return existing_admin


# Get All Users - Student
@router.get("/students", response_model=List[schemas.CompleteStudentDetails], status_code=status.HTTP_200_OK)
def get_all_students(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, gt=0)
):
    students = db.query(Users).filter(Users.role.any('user')).offset(skip).limit(limit).all()

    return students


# Get All Users - Admin
@router.get("/admins", response_model=List[schemas.CompleteAdminDetails], status_code=status.HTTP_200_OK)
def get_all_admins(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, gt=0)
):
    admins = db.query(Users).filter(Users.role.any('admin')).offset(skip).limit(limit).all()
    
    return admins


# Delete User - Student
@router.delete("/student/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(user_id: str, db: Session = Depends(get_db)):
    existing_student = db.query(Users).filter(Users.id == user_id).first()

    if not existing_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found."
        )

    db.delete(existing_student)
    db.commit()

    return {"detail": "Student deleted successfully."}


# Delete User - Admin
@router.delete("/admin/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin(user_id: str, db: Session = Depends(get_db)):
    existing_admin = db.query(Users).filter(Users.id == user_id).first()

    if not existing_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found."
        )

    db.delete(existing_admin)
    db.commit()

    return {"detail": "Admin deleted successfully."}
