from ..database import Base
from sqlalchemy import Column, String
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP, ARRAY

class Users(Base):
    __tablename__ = "users"

    # Metadata
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

    # User Fields
    id = Column(
        String(13),
        nullable=False,
        primary_key=True
    )
    name = Column(String(100), nullable=False)
    school = Column(String(100), nullable=False)
    dept = Column(String(40), nullable=True)
    email = Column(String(255), nullable=False)
    role = Column(ARRAY(String), nullable=False, server_default="{user}")
    password_hash = Column(String(255), nullable=False)
    admin_position = Column(String(100), nullable=True)
    admin_cabin_id = Column(String(50), nullable=True)
    student_batch = Column(String(10), nullable=True)
    student_course = Column(String(100), nullable=True)
    student_phone = Column(String(20), nullable=True)
