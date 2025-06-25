# 🎲 Guessing Game - Higher or Lower

A modern client-server application for a single-player number guessing game built with FastAPI and React.

## 📖 Overview

Players attempt to guess whether randomly generated numbers (0-1000) will be higher or lower than the current number. The game tracks consecutive correct guesses and maintains comprehensive statistics for each player.

## 🏗️ Architecture

The application follows a clean, layered architecture with clear separation of concerns:

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│                 │ ◄──────────────► │                 │
│   React Client  │                 │  FastAPI Server │
│                 │                 │                 │
└─────────────────┘                 └─────────────────┘
                                            │
                                            ▼
                                    ┌─────────────────┐
                                    │  MySQL Database │
                                    └─────────────────┘
```

### Backend (FastAPI + SQLAlchemy)
- **Controller Layer**: API endpoints and request handling
- **Service Layer**: Business logic and game rules
- **Repository Layer**: Data access and database operations  
- **Model Layer**: Database entities and schemas

### Frontend (React)
- **Component-based UI**: Modular React components
- **API Service Layer**: Centralized HTTP communication
- **State Management**: React hooks for local state

## 🎮 Game Rules

1. **Login**: Enter a username (no password required)
2. **Start Game**: Server generates a random number (0-1000)
3. **Make Guesses**: Choose if the next number will be "higher" or "lower"
4. **Continue Playing**: Each correct guess increases your streak
5. **Game Over**: One wrong guess ends the game and saves your score
6. **Statistics**: Track total games played and longest streak

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure MySQL database**:
   ```sql
   CREATE DATABASE guessing_game;
   ```

4. **Update database credentials** in `database.py` if needed:
   ```python
   DATABASE_URL = "mysql+pymysql://root:costincnva2016@localhost/guessing_game"
   ```

5. **Start the backend server**:
   ```bash
   python run.py
   ```

   Backend runs on: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install npm dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   Frontend runs on: `http://localhost:3000`

## 🔌 API Documentation

### User Management
- `POST /api/user` - Get or create user by username

### Game Operations  
- `POST /api/game/start` - Initialize new game session
- `POST /api/game/guess` - Submit higher/lower guess

### Statistics (REST Endpoints)
- `GET /api/statistics/{username}` - Retrieve user statistics
- `DELETE /api/statistics/{username}` - Clear all user game data

### System
- `GET /` - Health check
- `GET /docs` - Interactive API documentation (Swagger UI)

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Completed games records
CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT FOREIGN KEY REFERENCES users(id),
    consecutive_correct_guesses INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
);

-- Active game sessions
CREATE TABLE game_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT FOREIGN KEY REFERENCES users(id),
    current_number INT NOT NULL,
    consecutive_correct INT DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Features

### ✅ Core Requirements
- [x] Username-based authentication (no passwords)
- [x] Random number generation (0-1000 range)
- [x] Higher/lower guess validation
- [x] Consecutive correct guess tracking
- [x] Game over on incorrect guess
- [x] Statistics persistence and retrieval
- [x] Statistics clearing functionality

### ✅ Technical Requirements
- [x] Layered architecture (Models → Repository → Service → Controller)
- [x] Comprehensive server-side logging
- [x] REST endpoints for statistics operations
- [x] Modern, responsive UI design
- [x] Error handling and validation

### 🎨 UI/UX Features
- Modern glassmorphism design with gradients
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Real-time game state updates
- Visual feedback for all interactions
- Intuitive navigation flow

## 📁 Project Structure

```
guessing-game/
├── backend/
│   ├── requirements.txt       # Python dependencies
│   ├── database.py           # Database configuration
│   ├── models.py             # SQLAlchemy models
│   ├── schemas.py            # Pydantic schemas
│   ├── repository.py         # Data access layer
│   ├── service.py            # Business logic layer
│   ├── controller.py         # API endpoints
│   ├── main.py               # FastAPI application
│   └── run.py                # Server startup script
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Login.js      # User authentication
│   │   │   ├── Menu.js       # Main navigation
│   │   │   ├── Game.js       # Game interface
│   │   │   └── Statistics.js # Stats management
│   │   ├── services/
│   │   │   └── api.js        # API communication
│   │   ├── App.js            # Main application
│   │   ├── App.css           # Styling system
│   │   └── index.js          # React entry point
│   └── package.json          # Node.js dependencies
└── README.md                 # This documentation
```

## 🔄 Application Flow

```mermaid
graph TD
    A[User enters username] --> B[Get/Create User]
    B --> C[Main Menu]
    C --> D[Start Game]
    C --> E[View Statistics]
    C --> F[Logout]
    D --> G[Server generates random number]
    G --> H[User makes guess: Higher/Lower]
    H --> I{Guess correct?}
    I -->|Yes| J[Update streak, generate new number]
    I -->|No| K[Game over, save score]
    J --> H
    K --> L[Show final score]
    L --> C
    E --> M[Display total games & best streak]
    M --> N[Option to clear statistics]
    N --> C
```

## 🛠️ Development

### Backend Development
- **Framework**: FastAPI with automatic OpenAPI documentation
- **ORM**: SQLAlchemy with MySQL driver (PyMySQL)
- **Validation**: Pydantic models for request/response schemas
- **Architecture**: Dependency injection with layered services

### Frontend Development
- **Framework**: React 18 with functional components and hooks
- **HTTP Client**: Axios with interceptors for error handling
- **Styling**: Pure CSS with modern features (gradients, animations)
- **State Management**: React useState and useEffect hooks

### Testing the Application
1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Enter any username to login
4. Start a new game and make guesses
5. Check the browser network tab to see API calls
6. View statistics to see your performance

## 🚧 Error Handling

### Backend
- Comprehensive exception handling in all layers
- Detailed logging with timestamps and error context
- HTTP status codes for different error types
- Database transaction rollback on errors

### Frontend  
- User-friendly error messages
- Loading states during API calls
- Graceful degradation for network issues
- Form validation and input sanitization

## 🔧 Configuration

### Environment Variables
No environment variables required for basic setup. All configuration is in code files:

- **Database URL**: `backend/database.py`
- **API Base URL**: `frontend/src/services/api.js`  
- **CORS Settings**: `backend/main.py`

### Production Considerations
- Use environment variables for database credentials
- Enable HTTPS for production deployment
- Configure proper CORS origins
- Set up database connection pooling
- Implement rate limiting for API endpoints

## 📝 Logging

### Backend Logging
Comprehensive logging throughout all application layers:
- **Database Operations**: Connection status, query execution, errors
- **API Requests**: Endpoint access, request parameters, response status
- **Business Logic**: Game state changes, user actions, score calculations
- **Error Tracking**: Exception details, stack traces, recovery actions

### Log Levels
- **INFO**: Normal application flow, game events
- **ERROR**: Exception handling, database failures
- **DEBUG**: Detailed execution information (development only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of a software development assignment.

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MySQL is running and accessible
- Verify database credentials in `database.py`
- Ensure all Python dependencies are installed

**Frontend can't connect to backend:**
- Confirm backend is running on port 8000
- Check CORS configuration in `main.py`
- Verify API URL in `api.js`

**Database connection errors:**
- Create the `guessing_game` database manually
- Check MySQL user permissions
- Verify connection string format

**Game state issues:**
- Check browser console for JavaScript errors
- Verify API responses in Network tab
- Clear browser cache and restart application

---

**Built with ❤️ using FastAPI and React**
