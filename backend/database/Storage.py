import os
import oci
from dotenv import load_dotenv


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

def get_oci_client():
    try:
        private_key = os.getenv("OCI_PRIVATE_KEY")

        if not private_key:
            print("Error: OCI_PRIVATE_KEY not found in environment variable")
            return None

        private_key = private_key.strip().strip('"').strip("'")

        if "\\n" in private_key:
            private_key = private_key.replace("\\n", "\n")

        if not private_key.startswith("-"):
            print("Error: OCI_PRIVATE_KEY does not start with '-----BEGIN PRIVATE KEY-----'")
            return None

        if not private_key.endswith("-"):
            print("Error: OCI_PRIVATE_KEY does not end with '-----END PRIVATE KEY-----'")
            return None

        config = {
            "user": os.getenv("OCI_USER"),
            "key_content": os.getenv("OCI_PRIVATE_KEY"),
            "tenancy": os.getenv("OCI_TENANCY"),
            "fingerprint": os.getenv("OCI_FINGERPRINT"),
            "region": os.getenv("OCI_REGION", "us-ashburn-1")
        }
        oci.config.validate_config(config)
        client = oci.object_storage.ObjectStorageClient(config)
        return client
    except Exception as e:
        print("Errror connecting to OCI", e)
        print("\nDebug info: ")
        print(f" User OCID present: {bool(os.getenv('OCI_USER'))}")
        print(f" TENANCY present: {bool(os.getenv('OCI_TENANCY'))}")
        print(f" FINGERPRINT present: {bool(os.getenv('OCI_FINGERPRINT'))}")
        print(f" Private key present: {bool(os.getenv('OCI_PRIVATE_KEY'))}")
        return None

def get_namespace():
    client = get_oci_client()
    if client:
        return client.get_namespace().data
    return None

def upload_file(file_content: bytes, object_name: str):
    try:
        client = get_oci_client()
        namespace = get_namespace()
        bucket_name = os.getenv("OCI_BUCKET_NAME")

        client.put_object(
            namespace_name=namespace,
            bucket_name=bucket_name,
            object_name=object_name,
            put_object_body=file_content
        )
        return object_name
    except Exception as e:
        print("Errror uploading file", e)
        return None

def delete_file(object_name: str):
    try:
        client = get_oci_client()
        namespace = get_namespace()
        bucket_name = os.getenv("OCI__BUCKET_NAME")

        client.delete_object(
            namespace_name=namespace,
            bucket_name=bucket_name,
            object_name=object_name
        )
        return True
    except Exception as e:
        print("Errror deleting file", e)
        return None
def generate_URL(object_name: str):
    namespace = get_namespace()
    bucket_name = os.getenv("OCI__BUCKET_NAME")
    region = os.getenv("OCI_REGION", "us-ashburn-1")

    return f"https://{namespace}.objectstorage.{region}.oraclecloud.com/n/{namespace}/b/{bucket_name}/o/{object_name}"