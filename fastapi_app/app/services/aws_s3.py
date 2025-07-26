import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from typing import Optional
from fastapi.responses import StreamingResponse
from app.config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION

# Initialize the S3 client with credentials and region
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)


def download_file(bucket_name: str, object_key: str, download_path: str) -> bool:
    """
    Download a file from S3 to a local path.
    """
    try:
        s3_client.download_file(bucket_name, object_key, download_path)
        return True
    except (NoCredentialsError, ClientError) as e:
        print(f"Error downloading {object_key}: {e}")
        return False


def read_file_content(bucket_name: str, object_key: str) -> Optional[str]:
    """
    Read the content of a text file from S3 without downloading.
    """
    try:
        obj = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        return obj["Body"].read().decode("utf-8")
    except (NoCredentialsError, ClientError) as e:
        print(f"Error reading {object_key}: {e}")
        return None
