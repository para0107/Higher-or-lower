import random
import logging
from repository import UserRepository, GameRepository
from schemas import UserResponse, GameStartResponse, GuessResponse, StatisticsResponse, ClearStatsResponse

logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def get_or_create_user(self, username: str) -> UserResponse:
        try:
            user = self.user_repo.get_or_create_user(username)
            return UserResponse.from_orm(user)
        except Exception as e:
            logger.error(f"Error in get_or_create_user: {e}")
            raise


class GameService:
    def __init__(self, user_repo: UserRepository, game_repo: GameRepository):
        self.user_repo = user_repo
        self.game_repo = game_repo

    def start_game(self, username: str) -> GameStartResponse:
        try:
            user = self.user_repo.get_user_by_username(username)
            if not user:
                raise ValueError(f"User {username} not found")

            # Generate random number between 0 and 1000
            current_number = random.randint(0, 1000)
            session = self.game_repo.create_game_session(user.id, current_number)

            logger.info(f"Started game for {username} with number {current_number}")
            return GameStartResponse(
                session_id=session.id,
                current_number=current_number,
                message="Game started! Guess if the next number will be higher or lower."
            )
        except Exception as e:
            logger.error(f"Error starting game for {username}: {e}")
            raise

    def make_guess(self, session_id: int, guess: str) -> GuessResponse:
        try:
            session = self.game_repo.get_active_session(session_id)
            if not session:
                raise ValueError("Invalid or inactive game session")

            if guess not in ["higher", "lower"]:
                raise ValueError("Guess must be 'higher' or 'lower'")

            # Generate new number
            new_number = random.randint(0, 1000)
            current_number = session.current_number

            # Check if guess is correct
            is_correct = (
                    (guess == "higher" and new_number > current_number) or
                    (guess == "lower" and new_number < current_number)
            )

            if is_correct:
                # Update session with new number and increment streak
                consecutive_correct = session.consecutive_correct + 1
                self.game_repo.update_session(session_id, new_number, consecutive_correct)

                logger.info(f"Correct guess! Session {session_id}, streak: {consecutive_correct}")
                return GuessResponse(
                    success=True,
                    new_number=new_number,
                    consecutive_correct=consecutive_correct,
                    game_over=False,
                    message=f"Correct! The new number is {new_number}. Current streak: {consecutive_correct}"
                )
            else:
                # End game
                consecutive_correct = session.consecutive_correct
                self.game_repo.end_game_session(session_id)

                logger.info(f"Wrong guess! Game ended. Session {session_id}, final streak: {consecutive_correct}")
                return GuessResponse(
                    success=False,
                    new_number=new_number,
                    consecutive_correct=consecutive_correct,
                    game_over=True,
                    message=f"Wrong! The number was {new_number}. Game over! Final streak: {consecutive_correct}"
                )
        except Exception as e:
            logger.error(f"Error making guess for session {session_id}: {e}")
            raise

    def get_statistics(self, username: str) -> StatisticsResponse:
        try:
            user = self.user_repo.get_user_by_username(username)
            if not user:
                raise ValueError(f"User {username} not found")

            stats = self.game_repo.get_user_statistics(user.id)
            return StatisticsResponse(
                username=username,
                total_games=stats["total_games"],
                longest_streak=stats["longest_streak"]
            )
        except Exception as e:
            logger.error(f"Error getting statistics for {username}: {e}")
            raise

    def clear_statistics(self, username: str) -> ClearStatsResponse:
        try:
            user = self.user_repo.get_user_by_username(username)
            if not user:
                raise ValueError(f"User {username} not found")

            cleared_count = self.game_repo.clear_user_statistics(user.id)
            logger.info(f"Cleared statistics for {username}: {cleared_count} games")

            return ClearStatsResponse(
                message=f"Successfully cleared all game data for {username}",
                cleared_games=cleared_count
            )
        except Exception as e:
            logger.error(f"Error clearing statistics for {username}: {e}")
            raise