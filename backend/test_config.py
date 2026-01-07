"""Test script to verify database configuration."""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import Config
import re

# Get database URI
db_uri = Config.SQLALCHEMY_DATABASE_URI

# Mask password for display
masked_uri = re.sub(r':([^:@]+)@', r':****@', db_uri)

print("=" * 60)
print("DATABASE CONFIGURATION CHECK")
print("=" * 60)
print(f"Database URI: {masked_uri}")
print(f"Driver: {'PostgreSQL (psycopg2)' if 'postgresql' in db_uri.lower() else 'MySQL (pymysql)' if 'mysql' in db_uri.lower() else 'Other'}")
print("=" * 60)

# Check environment variables
print("\nEnvironment Variables:")
print(f"POSTGRES_URL: {os.getenv('POSTGRES_URL', 'Not set')}")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'Not set')}")
print(f"PG_USER: {os.getenv('PG_USER', 'Not set (using default)')}")
print(f"PG_DB: {os.getenv('PG_DB', 'Not set (using default)')}")

if 'mysql' in db_uri.lower():
    print("\n[WARNING] Database URI still points to MySQL!")
    print("   Make sure PostgreSQL is configured correctly.")
elif 'postgresql' in db_uri.lower():
    print("\n[SUCCESS] Database URI is correctly configured for PostgreSQL!")
else:
    print(f"\n[WARNING] Unknown database type: {db_uri.split('://')[0] if '://' in db_uri else 'Invalid URI'}")

