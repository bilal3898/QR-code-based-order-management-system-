import os


class Config:
    """
    Application configuration.

    This version is **PostgreSQL-first**. It prefers a POSTGRES_URL env var and
    falls back to a standard psycopg2 connection string.
    """

    # General Config
    SECRET_KEY = os.getenv(
        "SECRET_KEY", "nA5ETKwXP48FfsCOyAu0XSYa9PfkwC_fF4PH5VWiXZ0"
    )
    DEBUG = False
    TESTING = False

    # PostgreSQL configuration (defaults can be overridden via env)
    PG_USER = os.getenv("PG_USER", "user")
    PG_PASSWORD = os.getenv("PG_PASSWORD", "bilal@3132")
    PG_HOST = os.getenv("PG_HOST", "localhost")
    PG_PORT = os.getenv("PG_PORT", "5432")
    PG_DB = os.getenv("PG_DB", "restaurant")

    # Prefer explicit POSTGRES_URL if provided
    # Only use DATABASE_URL if it's a PostgreSQL URL (ignore MySQL URLs)
    _pg_url = os.getenv("POSTGRES_URL")
    if not _pg_url:
        _db_url = os.getenv("DATABASE_URL")
        # Only use DATABASE_URL if it's PostgreSQL, not MySQL
        if _db_url and ("postgresql" in _db_url.lower() or "postgres" in _db_url.lower()):
            _pg_url = _db_url
    
    if _pg_url:
        # If someone provided an asyncpg URL, adapt it to psycopg2
        if _pg_url.startswith("postgresql+asyncpg://"):
            _pg_url = _pg_url.replace(
                "postgresql+asyncpg://", "postgresql+psycopg2://", 1
            )
        # Ensure it uses psycopg2 driver
        if _pg_url.startswith("postgresql://") and "+psycopg2" not in _pg_url:
            _pg_url = _pg_url.replace("postgresql://", "postgresql+psycopg2://", 1)
        SQLALCHEMY_DATABASE_URI = _pg_url
    else:
        # Build default PostgreSQL URL using psycopg2 driver
        SQLALCHEMY_DATABASE_URI = (
            f"postgresql+psycopg2://{PG_USER}:"
            f"{PG_PASSWORD.replace('@', '%40')}"
            f"@{PG_HOST}:{PG_PORT}/{PG_DB}"
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Security Config
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"

    # CORS - Use specific origins when credentials are enabled (cannot use "*")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

    # JWT Config
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY", "Y-kYq5na9xeRXVRUfweO1w80eFRQdxMJzjfS_noHHdc"
    )
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 86400  # 1 day

    # Rate Limiting
    RATELIMIT_DEFAULT = "200 per day"
    RATELIMIT_STORAGE_URI = "memory://"

    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_ECHO = False
