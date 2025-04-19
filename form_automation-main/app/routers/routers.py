from fastapi import APIRouter

from .users import users
from .requests import requests
from .comments import comments
from .admin import admin


router = APIRouter(prefix=f'/api')


router.include_router(users.router)
# router.include_router(requests.router)
# router.include_router(comments.router)
# router.include_router(admin.router)