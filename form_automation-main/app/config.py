from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # Database Credentials
    database_username: str
    database_password: str
    database_hostname: str
    database_port: str
    database_name: str


    class Config:
        env_file = r"./.env"


settings = Settings()