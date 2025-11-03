import oracledb
import connect


def format_notification(row):
    return {
        "noti_id": row[0],
        "user_id": row[1],
        "noti_type": row[2],
        "review_type": row[3],
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
        cursor.execute("SELECT * FROM ADMIN.NOTIFICATIONS WHERE USER_ID = :1", (user_id,))
        rows = cursor.fetchall()

        reviews = []

        # Format the reviews into a list of dictionaries for the front end to more easily access the data
        for row in rows:
            review = format_notification(row)
            reviews.append(review)
        return reviews

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching notifications by user ID:", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)

