from ..database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Text, BigInteger, Identity
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

class Comments(Base):
    __tablename__ = "comments"

    # Comment Fields
    id = Column(
        BigInteger,
        Identity(start=1000, cycle=True),
        primary_key=True,
        nullable=False
    )
    request_id = Column(
        Integer,
        ForeignKey("requests.id"),
        nullable=False
    )
    creator_id = Column(
        String(13),
        ForeignKey("users.id"),
        nullable=False
    )
    message = Column(Text, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=False),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
