import oracledb
import uuid
from database import connect #NOTE: This is how the import needs to be for the backend to work on render. If testing locally and it doesn't work, you can temporarily change it to "import connect" but be sure to change it back before pushing.
from database.Storage import upload_file, delete_file, generate_URL


DEFAULT_PROFILE_PIC = "def_profile/Default_pfp.jpg"


def create_profile(user_id, bio):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        cursor.execute(""" INSERT INTO ADMIN.PROFILE (USER_ID, BIO, PROFILE_PIC) VALUES (:1, :2, :3) """, (user_id, bio, DEFAULT_PROFILE_PIC))
        connection.commit()
        print("Profile created successfully with profile picture.")
        return True

    except oracledb.IntegrityError as e:
        # ORA-00001 occurs when a unique constraint is violated
        error_obj, = e.args
        print("Integrity error:", error_obj.message)
        return False

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error creating profile:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def update_bio(user_id, new_bio):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    try:
        cursor.execute("""UPDATE ADMIN.PROFILE SET BIO = :1 WHERE USER_ID = :2 """, (new_bio, user_id))

        connection.commit()
        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: USER_ID {user_id} does not exist.")
            return False

        print(f"Bio for USER_ID {user_id} updated successfully to '{new_bio}'.")
        return True

    except oracledb.IntegrityError as e:
        error_obj, = e.args
        print("Integrity error:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

#gets profile with image url
def get_profile(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute("SELECT * FROM ADMIN.PROFILE WHERE USER_ID = :1", (user_id,))
        row = cursor.fetchone()
        if not row:
            print(f"User ID {user_id} not exist.")
            return None

        object_name = row[1]
        profile_pic_url = generate_URL(object_name) if object_name else None

        profile = {
            "user_id": row[0],
            "profile_pic": object_name,
            "profile_pic_url": profile_pic_url,
            "bio": row[2]
        }
        return profile

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching user profile:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

#uploads custom profile picture
def profile_picture_upload(user_id: int, profile_pic_file: bytes, file_extension: str):

    object_name = f"profiles/user_{user_id}_{uuid.uuid4()}.{file_extension}"

    try:
        upload_result = upload_file(profile_pic_file, object_name)

        if not upload_result:
            print(f"File {object_name} not uploaded to OCI.")
            return None

        print(f"File {object_name} uploaded to OCI.")

        connection, cursor = connect.start_connection()
        if not connection or not cursor:
            delete_file(object_name)
            print("Database connection failed. File deleted successfully from OCI.")
            return None

        try:
            cursor.execute(
                "SELECT PROFILE_PIC FROM ADMIN.PROFILE WHERE USER_ID = :1", (user_id,)
            )
            old_row = cursor.fetchone()
            old_object_name = old_row[0] if old_row else None

            cursor.execute(
                """
                UPDATE ADMIN.PROFILE
                SET PROFILE_PIC = :1
                WHERE USER_ID = :2
                """,
                (object_name, user_id)
            )

            if cursor.rowcount == 0:
                print(f"User ID {user_id} not exist.")
                delete_file(object_name)
                return None

            connection.commit()
            print(f"database updated successfully to '{object_name}'.")

            if old_object_name and old_object_name != DEFAULT_PROFILE_PIC:
                delete_file(old_object_name)
                print(f"File deleted successfully from OCI: {old_object_name}")

            return generate_URL(object_name)

        except oracledb.Error as e:
            error_obj, = e.args
            print("Database error fetching user profile:", error_obj.message)
            delete_file(object_name)
            return None
        finally:
            connect.stop_connection(connection, cursor)

    except Exception as e:
        print(f"Unexpected error:", e)
        try:
            delete_file(object_name)
        except:
            pass
        return None

#deletes custom images and reset back to default pic
def delete_profile_picture(user_id: int):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False
    try:
        cursor.execute(
            "SELECT PROFILE_PIC FROM ADMIN.PROFILE WHERE USER_ID = :1", (user_id,)
        )
        row = cursor.fetchone()
        if not row:
            print(f"User ID {user_id} not exist.")
            return False

        old_object_name = row[0]

        cursor.execute("""UPDATE ADMIN.PROFILE SET PROFILE_PIC = :1 WHERE USER_ID = :2""", (DEFAULT_PROFILE_PIC, user_id))

        connection.commit()
        print(f" Profile pic reset successfully for user {user_id}.")

        if old_object_name and old_object_name != DEFAULT_PROFILE_PIC:
            delete_file(old_object_name)
            print(f"File deleted successfully from OCI. {old_object_name}")
        return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)