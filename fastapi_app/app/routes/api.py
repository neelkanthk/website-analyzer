from fastapi import APIRouter, Request
import os

router = APIRouter()


@router.get("/")
def read_root(request: Request):
    app = request.app  # Access the FastAPI app instance
    return {
        "name": app.title,
        "version": app.version,
        "description": app.description
    }


@router.get("/health")
def health_check():
    return {"status": "ok"}
