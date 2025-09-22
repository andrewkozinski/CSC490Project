import oracledb
import os

from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Begin connection and return cursor
def start_connection():
    try:
        connection = oracledb.connect(
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASS"),
                dsn=os.getenv("DB_DSN"),
            )

        cursor = connection.cursor()
        return connection, cursor
    except oracledb.DatabaseError as e:
        print("Database error: ", e)
        return None, None

def stop_connection(connection, cursor):
    if cursor:
        cursor.close()
    if connection:
        connection.close()