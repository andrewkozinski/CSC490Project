import oracledb
from database import connect


# import connect

def add_user_vote(user_id, vote_id, vote_type):
    connection, cursor = connect.start_connection()

    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            INSERT INTO ADMIN.USER_VOTE (USER_ID, VOTE_ID, VOTE_TYPE)
            VALUES (:1, :2, :3)
            """,
            (user_id, vote_id, vote_type)
        )
        connection.commit()

        return {
            "user_id": user_id,
            "vote_id": vote_id,
        }

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        return {"error": "Integrity error: " + error_obj.message, "code": 400}

    except oracledb.Error as e:
        error_obj, = e.args
        return {"error": "Database error: " + error_obj.message, "code": 500}

    finally:
        connect.stop_connection(connection, cursor)


def delete_user_vote(user_id, vote_id):
    connection, cursor = connect.start_connection()

    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.USER_VOTE 
            WHERE USER_ID = :1 AND VOTE_ID = :2
            """,
            (user_id, vote_id)
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


def delete_all_user_vote(vote_id):
    connection, cursor = connect.start_connection()

    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.USER_VOTE 
            WHERE VOTE_ID = :1
            """,
            (vote_id,)
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


def vote_exists(user_id, vote_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT 1
            FROM ADMIN.USER_VOTE
            WHERE USER_ID = :1 AND VOTE_ID = :2
            """,
            (user_id, vote_id)
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


def print_user_votes():
    connection, cursor = connect.start_connection()
    cursor.execute("SELECT * FROM ADMIN.USER_VOTE")
    row = cursor.fetchall()
    if row:
        for row in row:
            print(row)
    else:
        print("No result")

def get_vote_type(user_id, vote_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT VOTE_TYPE
            FROM ADMIN.USER_VOTE
            WHERE USER_ID = :1 AND VOTE_ID = :2
            """,
            (user_id, vote_id)
        )

        result = cursor.fetchone()

        if result:
            return result[0]
        else:
            return None

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error retrieving vote type:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

def get_all_user_votes():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT USER_ID, VOTE_ID, VOTE_TYPE
            FROM ADMIN.USER_VOTE
            """
        )

        results = cursor.fetchall()
        votes = [
            {'user_id': user_id, 'vote_id': vote_id, 'vote_type': vote_type}
            for user_id, vote_id, vote_type in results
        ]
        return votes

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error retrieving all votes:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)
