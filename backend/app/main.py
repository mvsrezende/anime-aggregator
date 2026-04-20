from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.animes import router as animes_router
from app.api.routes.favorites import router as favorites_router
from app.api.routes.health import router as health_router
from app.api.routes.search_history import router as search_history_router
from app.core.settings import settings


app = FastAPI(
    title=settings.app_name,
    version="0.4.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Cache"],
)

app.include_router(health_router)
app.include_router(animes_router)
app.include_router(favorites_router)
app.include_router(search_history_router)