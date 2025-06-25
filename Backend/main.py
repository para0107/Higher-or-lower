from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controller import router
from database import create_tables
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Guessing Game API",
    description="A single-player number guessing game",
    version="1.0.0"
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api")

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Guessing Game API")
    try:
        create_tables()
        logger.info("Database tables created/verified successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

@app.get("/")
async def root():
    return {"message": "Guessing Game API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Guessing Game API server")
    uvicorn.run(app, host="0.0.0.0", port=8000)