from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging
import os
import time

from app.database import get_db
from app.models.message import Message
from app.websocket_manager import manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AlexMessenger Simple",
    description="Simple real-time chat with WebSocket and PostgreSQL",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    port = os.getenv("PORT", "unknown")
    logger.info("="*60)
    logger.info("APPLICATION STARTING UP")
    logger.info(f"Port: {port}")
    logger.info(f"Frontend URL: {os.getenv('FRONTEND_URL', 'Not set')}")
    logger.info("="*60)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    logger.info(f"Headers: {dict(request.headers)}")

    response = await call_next(request)

    process_time = time.time() - start_time
    logger.info(f"Request completed: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.3f}s")

    return response

# Get allowed origins from environment variable
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
allowed_origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]

logger.info(f"Configured CORS origins: {allowed_origins}")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - health check"""
    logger.info("Health check endpoint called")
    return {"status": "ok", "message": "AlexMessenger API is running"}

@app.get("/api/messages")
async def get_messages(db: AsyncSession = Depends(get_db)):
    """Get all messages from database (message history)"""
    logger.info("GET /api/messages - Fetching message history")
    result = await db.execute(
        select(Message).order_by(Message.created_at.asc())
    )
    messages = result.scalars().all()
    logger.info(f"Returning {len(messages)} messages")
    return [msg.to_dict() for msg in messages]

@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    db: AsyncSession = Depends(get_db)
):
    """WebSocket endpoint for real-time messaging"""
    await manager.connect(websocket)

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()

            logger.info(f"Received message: {data}")

            # Extract username and content
            username = data.get("username", "Anonymous")
            content = data.get("content", "")

            if not content:
                continue  # Skip empty messages

            # Save message to database
            message = Message(
                username=username,
                content=content
            )
            db.add(message)
            await db.commit()
            await db.refresh(message)

            logger.info(f"Saved message to DB: {message.id}")

            # Broadcast message to all connected clients
            await manager.broadcast(message.to_dict())

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
