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
            INSERT INTO USER_VOTE (USER_ID, VOTE_ID, VOTE_TYPE)
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
