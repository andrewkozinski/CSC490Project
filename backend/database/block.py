import oracledb
from database import connect


# import connect


def add_block(user_id, blocked_user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            INSERT INTO ADMIN.BLOCK (USER_ID, BLOCKED_USER_ID)
            VALUES (:1, :2)
            """,
            (user_id, blocked_user_id)
        )
        connection.commit()
        return {"message": f"User {blocked_user_id} successfully blocked by {user_id}.", "code": 201}

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        if "ORA-00001" in error_obj.message:
            return {"error": "Block relationship already exists.", "code": 409}
        elif "CHECK_NO_SELF_BLOCK" in error_obj.message:
            return {"error": "Cannot block self.", "code": 400}
        elif "REFERENCES" in error_obj.message:
            return {"error": "User ID(s) do not exist (Foreign Key violation).", "code": 404}

        return {"error": "Integrity error: " + error_obj.message, "code": 400}

    except oracledb.Error as e:
        error_obj, = e.args
        return {"error": "Database error: " + error_obj.message, "code": 500}

    finally:
        connect.stop_connection(connection, cursor)


def remove_block(user_id, blocked_user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.BLOCK
            WHERE USER_ID = :1 AND BLOCKED_USER_ID = :2
            """,
            (user_id, blocked_user_id)
        )

        if cursor.rowcount == 0:
            connection.rollback()
            return {"error": "Block relationship does not exist.", "code": 404}
        else:
            connection.commit()
            return {"message": f"User {blocked_user_id} successfully unblocked by {user_id}.", "code": 200}

    except oracledb.Error as e:
        error_obj, = e.args
        return {"error": "Database error: " + error_obj.message, "code": 500}

    finally:
        connect.stop_connection(connection, cursor)


def is_user_blocked(user_id, blocked_user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            SELECT 1 
            FROM ADMIN.BLOCK
            WHERE USER_ID = :1 AND BLOCKED_USER_ID = :2
            """,
            (user_id, blocked_user_id)
        )

        result = cursor.fetchone()

        return result is not None

    except oracledb.Error as e:
        error_obj, = e.args
        print(f"Database error checking block status: {error_obj.message}")
        return {"error": "Database error: " + error_obj.message, "code": 500}

    finally:
        connect.stop_connection(connection, cursor)

#Get all users who have blocked a specific user
def get_blocked_by(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT USER_ID 
            FROM ADMIN.BLOCK
            WHERE BLOCKED_USER_ID = :1
            """,
            (user_id,)
        )

        results = cursor.fetchall()

        blocked_by_users = [row[0] for row in results]

        return blocked_by_users

    except oracledb.Error as e:
        error_obj, = e.args
        print(f"Database error fetching blocked by users: {error_obj.message}")
        return None

    finally:
        connect.stop_connection(connection, cursor)