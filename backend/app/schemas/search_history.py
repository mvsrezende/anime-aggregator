from datetime import datetime

from pydantic import BaseModel


class SearchHistoryResponse(BaseModel):
    id: int
    user_id: int
    query: str
    created_at: datetime

    model_config = {"from_attributes": True}