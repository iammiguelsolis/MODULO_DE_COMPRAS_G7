import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseClient, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # TODO: Replace with environment variables or config
        url = os.environ.get("SUPABASE_URL", "https://your-project.supabase.co")
        key = os.environ.get("SUPABASE_KEY", "your-anon-key")
        self.client: Client = create_client(url, key)

    def get_client(self) -> Client:
        return self.client
