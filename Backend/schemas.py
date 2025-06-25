from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    username: str


class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class GameStart(BaseModel):
    username: str


class GameStartResponse(BaseModel):
    session_id: int
    current_number: int
    message: str


class GuessRequest(BaseModel):
    session_id: int
    guess: str  # "higher" or "lower"


class GuessResponse(BaseModel):
    success: bool
    new_number: Optional[int] = None
    consecutive_correct: int
    game_over: bool = False
    message: str


class StatisticsResponse(BaseModel):
    username: str
    total_games: int
    longest_streak: int


class ClearStatsResponse(BaseModel):
    message: str
    cleared_games: int