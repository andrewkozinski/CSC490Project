import oracledb
from database import connect
from database.users import valid_user_id


def get_review_owner(review_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        cursor.execute("SELECT USER_ID FROM ADMIN.REVIEWS WHERE REVIEW_ID = :1", (review_id,))
        result = cursor.fetchone()
        return result[0] if result else None
    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching review owner:", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)
