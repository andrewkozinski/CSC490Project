import oracledb
from database import connect


def format_notification(row):
    return {
        "noti_id": row[0],
        "user_id": row[1],
        "noti_type": row[2],
        "review_id": row[3],
        "action_user_id": row[4],
        "comment_id": row[5],
        "is_read": row[6],
        "created_at": row[7]
    }


def get_notifications_by_user_id(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        cursor.execute("SELECT * FROM ADMIN.NOTIFICATIONS WHERE USER_ID = :1 ORDER BY CREATED_AT DESC", (user_id,))
        rows = cursor.fetchall()

        notifications = []

        # Format the reviews into a list of dictionaries for the front end to more easily access the data
        for row in rows:
            notification = format_notification(row)
            notifications.append(notification)
        return notifications

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching notifications by user ID:", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)


def get_notification_count_by_user_id(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT COUNT(*) 
            FROM ADMIN.NOTIFICATIONS 
            WHERE USER_ID = :1 AND IS_READ = 0
            """,
            (user_id,)
        )

        result = cursor.fetchone()

        if result:
            return result[0]
        else:
            return 0

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching notification count:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)


def read_notification(noti_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            UPDATE ADMIN.NOTIFICATIONS
            SET IS_READ = 1
            WHERE NOTI_ID = :1
            """,
            (noti_id,)
        )

        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: NOTI_ID {noti_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"IS_READ for NOTI_ID {noti_id} updated successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error modifying is_read:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)
