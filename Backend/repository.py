from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import User, Game, GameSession
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_username(self, username: str) -> User:
        return self.db.query(User).filter(User.username == username).first()

    def create_user(self, username: str) -> User:
        try:
            db_user = User(username=username)
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            logger.info(f"Created new user: {username}")
            return db_user
        except Exception as e:
            logger.error(f"Error creating user {username}: {e}")
            self.db.rollback()
            raise

    def get_or_create_user(self, username: str) -> User:
        user = self.get_user_by_username(username)
        if not user:
            user = self.create_user(username)
            logger.info(f"User {username} created")
        else:
            logger.info(f"User {username} found")
        return user


class GameRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_game_session(self, user_id: int, current_number: int) -> GameSession:
        try:
            # End any existing active sessions for this user
            self.db.query(GameSession).filter(
                GameSession.user_id == user_id,
                GameSession.is_active == 1
            ).update({GameSession.is_active: 0})

            # Create new session
            session = GameSession(
                user_id=user_id,
                current_number=current_number,
                consecutive_correct=0,
                is_active=1
            )
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)
            logger.info(f"Created game session {session.id} for user {user_id}")
            return session
        except Exception as e:
            logger.error(f"Error creating game session: {e}")
            self.db.rollback()
            raise

    def get_active_session(self, session_id: int) -> GameSession:
        return self.db.query(GameSession).filter(
            GameSession.id == session_id,
            GameSession.is_active == 1
        ).first()

    def update_session(self, session_id: int, new_number: int, consecutive_correct: int) -> GameSession:
        try:
            session = self.get_active_session(session_id)
            if session:
                session.current_number = new_number
                session.consecutive_correct = consecutive_correct
                self.db.commit()
                self.db.refresh(session)
            return session
        except Exception as e:
            logger.error(f"Error updating session {session_id}: {e}")
            self.db.rollback()
            raise

    def end_game_session(self, session_id: int) -> None:
        try:
            session = self.get_active_session(session_id)
            if session:
                # Create completed game record
                game = Game(
                    user_id=session.user_id,
                    consecutive_correct_guesses=session.consecutive_correct,
                    completed_at=datetime.utcnow()
                )
                self.db.add(game)

                # Deactivate session
                session.is_active = 0
                self.db.commit()
                logger.info(f"Ended game session {session_id} with {session.consecutive_correct} correct guesses")
        except Exception as e:
            logger.error(f"Error ending game session {session_id}: {e}")
            self.db.rollback()
            raise

    def get_user_statistics(self, user_id: int) -> dict:
        try:
            total_games = self.db.query(Game).filter(Game.user_id == user_id).count()
            longest_streak = self.db.query(func.max(Game.consecutive_correct_guesses)).filter(
                Game.user_id == user_id
            ).scalar() or 0

            return {
                "total_games": total_games,
                "longest_streak": longest_streak
            }
        except Exception as e:
            logger.error(f"Error getting statistics for user {user_id}: {e}")
            raise

    def clear_user_statistics(self, user_id: int) -> int:
        try:
            # Clear completed games
            games_count = self.db.query(Game).filter(Game.user_id == user_id).count()
            self.db.query(Game).filter(Game.user_id == user_id).delete()

            # Clear any active sessions
            self.db.query(GameSession).filter(GameSession.user_id == user_id).delete()

            self.db.commit()
            logger.info(f"Cleared {games_count} games for user {user_id}")
            return games_count
        except Exception as e:
            logger.error(f"Error clearing statistics for user {user_id}: {e}")
            self.db.rollback()
            raise