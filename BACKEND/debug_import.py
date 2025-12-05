import sys
import os

# Add the parent directory to sys.path to allow importing from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app import create_app
    app = create_app()
    print("Successfully created app!")
except Exception as e:
    import traceback
    traceback.print_exc()
