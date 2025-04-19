from ..database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, BigInteger, Identity
from sqlalchemy.sql.expression import text

class RequestAdminAssignments(Base):
    __tablename__ = "request_admin_assignments"

    # Request Admin Assignment Fields
    id = Column(
        BigInteger,
        Identity(start=1000, cycle=True),
        primary_key=True,
        nullable=False,
    )
    request_id = Column(
        Integer,
        ForeignKey("requests.id"),
        nullable=False
    )
    admin_id = Column(
        String(13),
        ForeignKey("users.id"),
        nullable=False
    )
    decision = Column(String(20), nullable=False, default='Pending')
