# middleware/cors.py

from fastapi.middleware.cors import CORSMiddleware

def add_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Use specific origins in production like ["https://yourfrontend.com"]
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
