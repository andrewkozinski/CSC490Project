import connect
import oracledb

def add_user(user_id, username, hashed_password, email):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        cursor.execute(
            """
            INSERT INTO USERS (USER_ID, USERNAME, HASHED_PASSWORD, EMAIL)
            VALUES (:1, :2, :3, :4)
            """,
            (user_id, username, hashed_password, email)
        )
        connection.commit()
        print("User added successfully.")

    except oracledb.IntegrityError as e:
        # ORA-00001 occurs when a unique constraint is violated
        error_obj, = e.args
        if "ORA-00001" in error_obj.message:
            if "USER_ID" in error_obj.message:
                print(f"Error: USER_ID {user_id} already exists.")
            elif "USERNAME" in error_obj.message:
                print(f"Error: USERNAME '{username}' already exists.")
            elif "EMAIL" in error_obj.message:
                print(f"Error: EMAIL '{email}' already exists.")
        else:
            print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error inserting user:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def delete_user(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        cursor.execute(
            """
            DELETE FROM USERS WHERE USER_ID = :1
            """,
            (user_id,)
        )
        if cursor.rowcount == 0:  # nothing deleted
            print(f"Error: USER_ID {user_id} does not exist.")
        else:
            connection.commit()
            print(f"User with USER_ID {user_id} deleted successfully.")

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting user:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

# add_user(
#     "100",
#     "JohnSmith2",
#     "123",
#     "john2@gmail.com"
# )

delete_user("100")