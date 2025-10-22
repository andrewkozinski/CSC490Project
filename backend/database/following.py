import oracledb
from database import connect


# import connect

def add_following(follow_id, user_id):  # followee, follower
    connection, cursor = connect.start_connection()

    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            INSERT INTO ADMIN.FOLLOWING (FOLLOW_ID, USER_ID)
            VALUES (:1, :2)
            """,
            (follow_id, user_id)
        )
        connection.commit()

        return {
            "follow_id": follow_id,
            "user_id": user_id
        }

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        return {"error": "Integrity error: " + error_obj.message, "code": 400}

    except oracledb.Error as e:
        error_obj, = e.args
        return {"error": "Database error: " + error_obj.message, "code": 500}

    finally:
        connect.stop_connection(connection, cursor)


def delete_following(follow_id, user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.FOLLOWING
            WHERE FOLLOW_ID = :1 AND USER_ID = :2
            """,
            (follow_id, user_id)
        )
        connection.commit()

        return {
            "Success": True,
        }

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        return {"error": "Integrity error: " + error_obj.message, "code": 400}

    except oracledb.Error as e:
        error_obj, = e.args
        return {"error": "Database error: " + error_obj.message, "code": 500}

    finally:
        connect.stop_connection(connection, cursor)


def delete_all_following(follow_id): # for account deletion
    connection, cursor = connect.start_connection()

    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.FOLLOWING 
            WHERE FOLLOW_ID = :1
            """,
            (follow_id,)
        )
        connection.commit()

        return {
            "Success": True,
        }

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        return {"error": "Integrity error: " + error_obj.message, "code": 400}

    except oracledb.Error as e:
        error_obj, = e.args
        return {"error": "Database error: " + error_obj.message, "code": 500}

    finally:
        connect.stop_connection(connection, cursor)


def following_exists(follow_id, user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT 1
            FROM ADMIN.USER_VOTE
            WHERE FOLLOW_ID = :1 AND USER_ID = :2
            """,
            (follow_id, user_id)
        )

        result = cursor.fetchone()

        if result:
            print(f"Vote with USER_ID {user_id} and VOTE_ID {vote_id} exists.")
            return True
        else:
            print(f"No vote found for USER_ID {user_id} and VOTE_ID {vote_id}.")
            return False

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error checking vote:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)
