from pydantic import EmailStr

import oracledb
#from database import connect
import connect

def add_user(username, hashed_password, email):
    connection, cursor = connect.start_connection()
    user_id = get_new_user_id()
    if not connection or not cursor:
        return {"error": "Failed to connect to database.", "code": 500}

    try:
        cursor.execute(
            """
            INSERT INTO USERS (USER_ID, USERNAME, HASHED_PASSWORD, EMAIL)
            VALUES (:1, :2, :3, :4)
            """,
            (user_id, username, hashed_password, email)
        )
        connection.commit()
        return {"user_id": user_id}

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        if "ORA-00001" in error_obj.message:
            if "USERNAME" in error_obj.message:
                return {"error": f"USERNAME '{username}' already exists.", "code": 409}
            elif "EMAIL" in error_obj.message:
                return {"error": f"EMAIL '{email}' already exists.", "code": 409}
        return {"error": "Integrity error: " + error_obj.message, "code": 400}

    except oracledb.Error as e:
        error_obj, = e.args
        return {"error": "Database error: " + error_obj.message, "code": 500}

    finally:
        connect.stop_connection(connection, cursor)

def delete_user_permanent(user_id):
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
            print(f"User with USER_ID {user_id} permanently deleted successfully.")

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting user:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def delete_user(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        new_name = "deleted_user" + str(user_id)
        cursor.execute(
            """
            UPDATE USERS 
            SET USERNAME = :1,
                HASHED_PASSWORD = NULL,
                EMAIL = NULL
            WHERE USER_ID = :2
            """,
            (new_name, user_id)
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

def print_users():
    connection, cursor = connect.start_connection()
    cursor.execute("SELECT * FROM USERS")
    row = cursor.fetchall()
    if row:
        for row in row:
            print(row)
    else:
        print("No result")

def get_new_user_id():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    cursor.execute("SELECT MAX(USER_ID) FROM USERS")
    result = cursor.fetchone()

    connect.stop_connection(connection, cursor)
    if result and result[0] is not None:
        return result[0] + 1 # Add one to maximum existing user id
    else:
        print("No users found in the database.")
        return 0

def update_username(user_id, new_username):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        cursor.execute(
            """
            UPDATE USERS
            SET USERNAME = :1
            WHERE USER_ID = :2
            """,
            (new_username, user_id)
        )

        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: USER_ID {user_id} does not exist.")
        else:
            connection.commit()
            print(f"Username for USER_ID {user_id} updated successfully to '{new_username}'.")

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        if "ORA-00001" in error_obj.message and "USERNAME" in error_obj.message:
            print(f"Error: USERNAME '{new_username}' already exists.")
        else:
            print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error updating USERNAME:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def update_email(user_id, new_email):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        cursor.execute(
            """
            UPDATE USERS
            SET EMAIL = :1
            WHERE USER_ID = :2
            """,
            (new_email, user_id)
        )

        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: USER_ID {user_id} does not exist.")
        else:
            connection.commit()
            print(f"Email for USER_ID {user_id} updated successfully to '{new_email}'.")

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        if "ORA-00001" in error_obj.message and "EMAIL" in error_obj.message:
            print(f"Error: EMAIL '{new_email}' already exists.")
        else:
            print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error updating EMAIL:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def update_password(user_id, new_hashed_password):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        cursor.execute(
            """
            UPDATE USERS
            SET HASHED_PASSWORD = :1
            WHERE USER_ID = :2
            """,
            (new_hashed_password, user_id)
        )

        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: USER_ID {user_id} does not exist.")
        else:
            connection.commit()
            print(f"Hashed Password for USER_ID {user_id} updated successfully to '{new_hashed_password}'.")

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        if "ORA-00001" in error_obj.message and "HASHED_PASSWORD" in error_obj.message:
            print(f"Error: HASHED_PASSWORD '{new_hashed_password}' already exists.")
        else:
            print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error updating HASHED_PASSWORD:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def get_all_users():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return []

    try:
        cursor.execute("SELECT * FROM USERS")
        rows = cursor.fetchall()
        users = []
        for row in rows:
            user = {
                "USER_ID": row[0],
                "USERNAME": row[1],
                "HASHED_PASSWORD": row[2],
                "EMAIL": row[3]
            }
            users.append(user)
        return users

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching users:", error_obj.message)
        return []

    finally:
        connect.stop_connection(connection, cursor)

# Fetch user by email
def get_by_email(email: EmailStr):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return []

    try:
        cursor.execute("SELECT * FROM USERS WHERE EMAIL = :1", (email,))
        row = cursor.fetchone()
        if row:
            user = {
                "USER_ID": row[0],
                "USERNAME": row[1],
                "HASHED_PASSWORD": row[2],
                "EMAIL": row[3]
            }
            return user
        else:
            print(f"No user found with EMAIL '{email}'.")
            return None
    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching user by email:", error_obj.message)
        return None

def valid_user_id(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        cursor.execute("SELECT * FROM USERS WHERE USER_ID = :1", (user_id,))
        row = cursor.fetchone()
        if row:
            return True
        else:
            return False
    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching user by ID:", error_obj.message)

#print_users()
#delete_user(8)
#delete_user_permanent(12)
#print_users()