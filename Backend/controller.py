from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from repository import UserRepository, GameRepository
from service import UserService, GameService
from schemas import (
    UserCreate, UserResponse, GameStart, GameStartResponse,
    GuessRequest, GuessResponse, StatisticsResponse, ClearStatsResponse
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    user_repo = UserRepository(db)
    return UserService(user_repo)

def get_game_service(db: Session = Depends(get_db)) -> GameService:
    user_repo = UserRepository(db)
    game_repo = GameRepository(db)
    return GameService(user_repo, game_repo)

@router.post("/user", response_model=UserResponse)
async def get_or_create_user(
    user_data: UserCreate,
    user_service: UserService = Depends(get_user_service)
):
    """Get or create a user by username"""
    try:
        logger.info(f"Request to get/create user: {user_data.username}")
        return user_service.get_or_create_user(user_data.username)
    except Exception as e:
        logger.error(f"Error in get_or_create_user endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/game/start", response_model=GameStartResponse)
async def start_game(
    game_data: GameStart,
    game_service: GameService = Depends(get_game_service)
):
    """Start a new game for a user"""
    try:
        logger.info(f"Request to start game for user: {game_data.username}")
        return game_service.start_game(game_data.username)
    except ValueError as e:
        logger.error(f"ValueError in start_game: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error in start_game endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/game/guess", response_model=GuessResponse)
async def make_guess(
    guess_data: GuessRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Make a guess in the current game"""
    try:
        logger.info(f"Guess request: session {guess_data.session_id}, guess: {guess_data.guess}")
        return game_service.make_guess(guess_data.session_id, guess_data.guess)
    except ValueError as e:
        logger.error(f"ValueError in make_guess: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error in make_guess endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/statistics/{username}", response_model=StatisticsResponse)
async def get_statistics(
    username: str,
    game_service: GameService = Depends(get_game_service)
):
    """Get user statistics (REST endpoint)"""
    try:
        logger.info(f"Request for statistics: {username}")
        return game_service.get_statistics(username)
    except ValueError as e:
        logger.error(f"ValueError in get_statistics: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error in get_statistics endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/statistics/{username}", response_model=ClearStatsResponse)
async def clear_statistics(
    username: str,
    game_service: GameService = Depends(get_game_service)
):
    """Clear user statistics (REST endpoint)"""
    try:
        logger.info(f"Request to clear statistics: {username}")
        return game_service.clear_statistics(username)
    except ValueError as e:
        logger.error(f"ValueError in clear_statistics: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error in clear_statistics endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))