import oracledb
#import connect
from database import connect

def get_new_comm_id():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    cursor.execute("SELECT MAX(COMM_ID) FROM COMMENTS")
    result = cursor.fetchone()

    connect.stop_connection(connection, cursor)
    if result and result[0] is not None:
        return result[0] + 1 # Add one to maximum existing comm id
    else:
        print("No comments found in the database.")
        return 0

def add_comment(review_id, user_id, comm_text, parent_comm_id):
    connection, cursor = connect.start_connection()
    comm_id = get_new_comm_id()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        cursor.execute(
            """
            INSERT INTO COMMENTS (COMM_ID, REVIEW_ID, USER_ID, COMM_TEXT, PARENT_COMM_ID)
            VALUES (:1, :2, :3, :4, :5)
            """,
            (comm_id, review_id, user_id, comm_text, parent_comm_id)
        )
        connection.commit()
        print("Comment added successfully.")
        # Return the new comment ID
        return comm_id

    except oracledb.IntegrityError as e:
        # ORA-00001 occurs when a unique constraint is violated
        error_obj, = e.args
        if "ORA-00001" in error_obj.message:
            if "COMM_ID" in error_obj.message: # PK
                print(f"Error: COMM_ID {comm_id} already exists.")
        else:
            print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error inserting comment:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def delete_comment(comm_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.COMMENTS WHERE COMM_ID = :1
            """,
            (comm_id,)
        )
        if cursor.rowcount == 0:  # nothing deleted
            print(f"Error: COMM_ID {comm_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Comment with COMM_ID {comm_id} deleted successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting review:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def print_comments():
    connection, cursor = connect.start_connection()
    cursor.execute("SELECT * FROM COMMENTS")
    row = cursor.fetchall()
    if row:
        for row in row:
            print(row)
    else:
        print("No result")

def get_all_comments():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute("SELECT * FROM COMMENTS")
        rows = cursor.fetchall()
        comments = []
        for row in rows:
            comment = {
                "comm_id": row[0],
                "review_id": row[1],
                "user_id": row[2],
                "comm_text": row[3],
                "parent_comm_id": row[4]
            }
            comments.append(comment)
        return comments

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching comments:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

def edit_comment(comm_id, comm_text):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            UPDATE COMMENTS
            SET COMM_TEXT = :1
            WHERE COMM_ID = :2
            """,
            (comm_text, comm_id)
        )

        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: COMM_ID {comm_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"COMM_TEXT for COMM_ID {comm_id} updated successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error modifying comm text:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def get_comments_by_review_id(review_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT * FROM COMMENTS
            WHERE REVIEW_ID = :1
            """,
            (review_id,)
        )
        rows = cursor.fetchall()
        comments = []
        for row in rows:
            comment = {
                "comm_id": row[0],
                "review_id": row[1],
                "user_id": row[2],
                "comm_text": row[3],
                "parent_comm_id": row[4]
            }
            comments.append(comment)
        return comments

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching comments by review id:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

def get_comments_by_parent_comm_id(parent_comm_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT * FROM COMMENTS
            WHERE PARENT_COMM_ID = :1
            """,
            (parent_comm_id,)
        )
        rows = cursor.fetchall()
        comments = []
        for row in rows:
            comment = {
                "comm_id": row[0],
                "review_id": row[1],
                "user_id": row[2],
                "comm_text": row[3],
                "parent_comm_id": row[4]
            }
            comments.append(comment)
        return comments

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching comments by parent comm id:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)