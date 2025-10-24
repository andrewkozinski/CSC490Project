import oracledb
# from database import connect


import connect


def add_follower(follow_id, user_id):  # followee, follower
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            INSERT INTO ADMIN.FOLLOWERS (FOLLOW_ID, USER_ID)
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


def delete_follower(follow_id, user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.FOLLOWERS
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


def delete_all_followers(follow_id):  # for account deletion?
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.FOLLOWERS
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


def follower_exists(follow_id, user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT 1
            FROM ADMIN.FOLLOWERS
            WHERE FOLLOW_ID = :1 AND USER_ID = :2
            """,
            (follow_id, user_id)
        )

        result = cursor.fetchone()

        if result:
            print(f"Following with FOLLOW_ID {follow_id} and USER_ID {user_id} exists.")
            return True
        else:
            print(f"No following found with FOLLOW_ID {follow_id} and USER_ID {user_id}.")
            return False

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error checking followers:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)


def get_all_followers(follow_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT * FROM ADMIN.FOLLOWERS
            WHERE FOLLOW_ID = :1
            """,
            (follow_id,)
        )

        results = cursor.fetchall()
        followings = [
            {'follow_id': follow_id, 'user_id': user_id}
            for follow_id, user_id in results
        ]
        return followings

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error retrieving followers:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)


def get_follower_count(follow_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT COUNT(*) FROM ADMIN.FOLLOWING
            WHERE FOLLOW_ID = :1
            """,
            (follow_id,)
        )

        result = cursor.fetchone()

        if result:
            follower_count = result[0]
            return follower_count
        else:
            return 0

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error retrieving follower count:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

