import oracledb
import os

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

def stop_connection(connection, cursor):
    connection.close()
    cursor.close()