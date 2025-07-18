from azure.storage.blob import BlobServiceClient, ContentSettings
from azure.core.exceptions import ResourceExistsError, ResourceNotFoundError
import os
from dotenv import load_dotenv

load_dotenv()

connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = os.getenv("AZURE_CONTAINER_NAME")

blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client(container_name)

def upload_resume_to_azure(uid: str, candidate_id: str, filename: str, content: bytes, content_type: str) -> str:
    try:
        blob_name = f"{uid}/{candidate_id}/{filename}"
        blob_client = container_client.get_blob_client(blob_name)

        blob_client.upload_blob(
            content,
            overwrite=True,
                content_settings = ContentSettings(content_type=content_type or "application/octet-stream")
                )


        return f"https://{blob_service_client.account_name}.blob.core.windows.net/{container_name}/{blob_name}"

    except Exception as e:
        raise RuntimeError(f"Failed to upload resume to Azure: {str(e)}")

def delete_resume_from_azure(blob_path: str):
    try:
        blob_client = container_client.get_blob_client(blob_path)
        blob_client.delete_blob()
    except ResourceNotFoundError:
        raise RuntimeError(f"Blob not found: {blob_path}")
    except Exception as e:
        raise RuntimeError(f"Failed to delete blob: {str(e)}")
