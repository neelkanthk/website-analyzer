from fastapi import APIRouter, Request
from app.services.aws_s3 import read_file_content, download_file
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

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


@router.get("/read-lighthouse-audit-file")
def read_s3_file():
    bucket_name = os.getenv("AWS_S3_BUCKET_NAME")
    object_key = "audits/021a23dd-c2a5-4199-87bc-7b7fea24f3a0.json"  # Replace with the file key in S3

    content = read_file_content(bucket_name, object_key)
    if content:
        return {"file_content": content}
    return {"error": "Unable to read file"}


@router.get("/download-lighthouse-audit-file")
def download_s3_file():
    bucket_name = os.getenv("AWS_S3_BUCKET_NAME")
    object_key = "audits/021a23dd-c2a5-4199-87bc-7b7fea24f3a0.json"

    download_path = f"tmp-downloads/{object_key.split('/')[-1]}"  # Save to a temporary path
    success = download_file(bucket_name, object_key, download_path)
    if success:
        return {"message": f"File downloaded successfully to {download_path}"}
    return {"error": "Failed to download file"}
