from fastapi import FastAPI
from app.routes import api, webhook
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()


# Create FastAPI application instance
app = FastAPI(
    title=os.getenv("APP_NAME"),
    description=os.getenv("APP_DESCRIPTION"),
    version=os.getenv("APP_VERSION")
)

# Include routes
app.include_router(api.router)
app.include_router(webhook.router)
