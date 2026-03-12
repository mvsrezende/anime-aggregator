from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=None, extra="ignore")

    app_name: str = "anime-aggregator-api"
    app_env: str = "dev"

    database_url: str = "postgresql+psycopg://anime:anime@localhost:5432/anime"
    jikan_base_url: str = "https://api.jikan.moe/v4"

    default_user_email: str = "marcos@local.dev"


settings = Settings()