from ..database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Text, BigInteger, Identity
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

class Requests(Base):
    __tablename__ = "requests"

    # Request Fields
    id = Column(
        BigInteger,
        Identity(start=1000, cycle=True),
        primary_key=True,
        nullable=False,        
    )
    
    creator_id = Column(
        String(13),
        ForeignKey("users.id"),
        nullable=False
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    attachments = Column(Text, nullable=True)
    deadline = Column(TIMESTAMP(timezone=True), nullable=True)
    created_date = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    status = Column(String(20), nullable=False, default='Submitted')
    priority = Column(String(20), nullable=False, default='Normal')
