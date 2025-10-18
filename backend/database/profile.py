import oracledb
#import connect
from database import connect

def create_profile(user_id, profile_pic, bio):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            INSERT INTO PROFILE (USER_ID, PROFILE_PIC, BIO)
            VALUES (:1, :2, :3)
            """,
            (user_id, profile_pic, bio)
        )
        connection.commit()
        print("Profile created successfully.")

    except oracledb.IntegrityError as e:
        # ORA-00001 occurs when a unique constraint is violated
        error_obj, = e.args
        print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error creating profile:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def update_bio(user_id, new_bio):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        cursor.execute(
            """
            UPDATE PROFILE
            SET BIO = :1
            WHERE USER_ID = :2
            """,
            (new_bio, user_id)
        )

        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: USER_ID {user_id} does not exist.")
        else:
            connection.commit()
            print(f"Bio for USER_ID {user_id} updated successfully to '{new_bio}'.")

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error updating Bio:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def update_profile_pic(user_id, new_profile_pic):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        cursor.execute(
            """
            UPDATE PROFILE
            SET PROFILE_PIC = :1
            WHERE USER_ID = :2
            """,
            (new_profile_pic, user_id)
        )

        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: USER_ID {user_id} does not exist.")
        else:
            connection.commit()
            print(f"Profile Pic for USER_ID {user_id} updated successfully to '{new_profile_pic}'.")

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error updating Profile Pic:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def get_profile(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute("SELECT * FROM PROFILE WHERE USER_ID = :1"), (user_id,)
        row = cursor.fetchone()
        profile = {
            "user_id": row[0],
            "profile_pic": row[1],
            "bio": row[2]
        }
        return profile

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching user profile:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)