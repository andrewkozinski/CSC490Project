import oracledb
from database import connect


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


def get_notification_count(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return 0
    try:
        cursor.execute("SELECT COUNT(*) FROM ADMIN.NOTIFICATIONS WHERE USER_ID = :1", (user_id,))
        result = cursor.fetchone()
        return result[0] if result else 0
    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching notification count:", error_obj.message)
        return 0
    finally:
        connect.stop_connection(connection, cursor)


def delete_oldest_notification(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return False

    try:
        delete_sql = """
            DELETE FROM ADMIN.NOTIFICATIONS
            WHERE NOTI_ID = (
                SELECT NOTI_ID
                FROM ADMIN.NOTIFICATIONS
                WHERE USER_ID = :1
                ORDER BY CREATED_AT ASC
                FETCH FIRST 1 ROW ONLY
            )
        """
        cursor.execute(delete_sql, (user_id,))
        connection.commit()
        return cursor.rowcount > 0
    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting oldest notification:", error_obj.message)
        return False
    finally:
        connect.stop_connection(connection, cursor)


def insert_notification(target_user_id, noti_type, review_id, action_user_id, comment_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        v_notif_count = get_notification_count(target_user_id)
        if v_notif_count >= 5:
            delete_oldest_notification(target_user_id)

        cursor.execute(
            """
            INSERT INTO ADMIN.NOTIFICATIONS(
                NOTI_ID, USER_ID, NOTI_TYPE, REVIEW_ID, ACTION_USER_ID, COMMENT_ID, IS_READ, CREATED_AT
            ) VALUES (
                ADMIN.NOTIFICATION_SEQ.NEXTVAL, :1, :2, :3, :4, :5, 0, SYSDATE
            )
            """,
            (target_user_id, noti_type, review_id, action_user_id, comment_id)
        )

        connection.commit()
        print(f"Notification (Type: {noti_type}) for User {target_user_id} added successfully.")
        return True

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        print("Integrity error inserting notification:", error_obj.message)
        return False

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error inserting notification:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)