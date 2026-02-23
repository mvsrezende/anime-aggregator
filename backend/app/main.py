from fastapi import FastAPI

from app.core.settings import settings
from app.api.routes.health import router as health_router
from app.api.routes.animes import router as animes_router


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)

app.include_router(health_router)
app.include_router(animes_router)