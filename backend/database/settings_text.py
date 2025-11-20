import oracledb
from database import connect
from database.users import valid_user_id


def get_new_setting_text_id():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    cursor.execute("SELECT MAX(SETTING_ID) FROM ADMIN.SETTINGS_TEXT")
    result = cursor.fetchone()

    connect.stop_connection(connection, cursor)
    if result and result[0] is not None:
        return result[0] + 1
    else:
        return 0


def add_settings_text(user_id, review_text_enabled=1):
    connection, cursor = connect.start_connection()
    setting_id = get_new_setting_text_id()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    if valid_user_id(user_id):
        try:
            if review_text_enabled not in (0, 1):
                review_text_enabled = 1

            cursor.execute(
                """
                INSERT INTO ADMIN.SETTINGS_TEXT 
                (SETTING_ID, USER_ID, REVIEW_TEXT_ENABLED)
                VALUES (:1, :2, :3)
                """,
                (setting_id, user_id, review_text_enabled)
            )
            connection.commit()

            print(f"Text setting for USER_ID {user_id} added successfully with SETTING_ID {setting_id}.")
            return setting_id

        except oracledb.IntegrityError as e:
            error_obj, = e.args
            if "ORA-00001" in error_obj.message:
                if "UNIQUE_SETTINGS_USER" in error_obj.message:
                    print(f"Error: Text setting already exists for USER_ID {user_id}.")
                elif "SETTINGS_TEXT_PK" in error_obj.message:
                    print(f"Error: SETTING_ID {setting_id} already exists.")
            else:
                print("Integrity error:", error_obj.message)
            return None

        except oracledb.Error as e:
            error_obj, = e.args
            print("Database error inserting settings text:", error_obj.message)
            return None

        finally:
            connect.stop_connection(connection, cursor)
    else:
        print(f"User with USER_ID {user_id} does not exist.")
        return None


def get_settings_text_by_user_id(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT SETTING_ID, USER_ID, REVIEW_TEXT_ENABLED 
            FROM ADMIN.SETTINGS_TEXT 
            WHERE USER_ID = :1
            """,
            (user_id,)
        )
        row = cursor.fetchone()

        if row:
            return {
                "setting_id": row[0],
                "user_id": row[1],
                "review_text_enabled": row[2]
            }
        else:
            print(f"No text settings found for USER_ID {user_id}.")
            return None

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching settings text:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)


def update_review_text_enabled(user_id, review_text_enabled):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    try:
        if review_text_enabled not in (0, 1):
            print("Invalid value for review_text_enabled. Must be 0 or 1.")
            return False

        cursor.execute(
            """
            UPDATE ADMIN.SETTINGS_TEXT
            SET REVIEW_TEXT_ENABLED = :1
            WHERE USER_ID = :2
            """,
            (review_text_enabled, user_id)
        )

        if cursor.rowcount == 0:
            print(f"Error: Settings not found for USER_ID {user_id}. No update performed.")
            return False
        else:
            connection.commit()
            print(f"REVIEW_TEXT_ENABLED for USER_ID {user_id} updated successfully to {review_text_enabled}.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error modifying settings text:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)
