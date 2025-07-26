from fastapi import APIRouter, Request
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

router = APIRouter()


@router.get("/webhook/health")
def webhook_health_check():
    return {"status": "ok"}


@router.post("/webhook/audit/metadata")
async def receive_audit_metadata(request: Request):
    try:
        data = await request.json()
        # Process the received metadata
        print("Received audit metadata:", data)

        # Store the metadata or perform any necessary actions

        return {"status": "success", "message": "Metadata received successfully"}
    except Exception as e:
        print("Error processing webhook:", str(e))
        return {"status": "error", "message": "Failed to process metadata"}
