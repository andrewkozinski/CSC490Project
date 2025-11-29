import oracledb
# from database import connect
import connect


# Add a favorite entry
def add_favorites(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    # Convert book string → numeric ID
    if media_type == "book":
        cursor.execute("SELECT ADMIN.get_fav_book_id(:1) FROM DUAL", (media_id,))
        result = cursor.fetchone()
        db_media_id = result[0]
    else:
        try:
            db_media_id = int(media_id)
        except ValueError:
            print(f"Error: MEDIA_ID '{media_id}' must be integer for non-books.")
            return False

    try:
        if not is_favorited(user_id, db_media_id, media_type):
            cursor.execute(
                """
                INSERT INTO ADMIN.favorites (user_id, media_id, media_type)
                VALUES (:1, :2, :3)
                """,
                (user_id, db_media_id, media_type)
            )
            connection.commit()
            print("Favorite added successfully.")
            return True
        else:
            print("Favorite already exists.")
            return False

    except oracledb.Error:
        return False

    finally:
        connect.stop_connection(connection, cursor)


# Convert (user, media) → fav_id
def get_list_id_from_media_type_and_id(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return None

    # Convert media_id for books
    if media_type == "book":
        cursor.execute("SELECT ADMIN.get_fav_book_id(:1) FROM DUAL", (media_id,))
        result = cursor.fetchone()
        db_media_id = result[0]
    else:
        try:
            db_media_id = int(media_id)
        except ValueError:
            return None

    try:
        cursor.execute(
            """
            SELECT fav_id
            FROM ADMIN.favorites
            WHERE user_id = :1 AND media_id = :2 AND media_type = :3
            """,
            (user_id, db_media_id, media_type)
        )
        row = cursor.fetchone()
        return row[0] if row else None

    finally:
        connect.stop_connection(connection, cursor)


# Delete favorite by media + type
def delete_by_media_id_and_type(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return False

    # Convert for books
    if media_type == "book":
        cursor.execute("SELECT ADMIN.get_fav_book_id(:1) FROM DUAL", (media_id,))
        result = cursor.fetchone()
        db_media_id = result[0]
    else:
        try:
            db_media_id = int(media_id)
        except ValueError:
            return False

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.favorites
            WHERE user_id = :1 AND media_id = :2 AND media_type = :3
            """,
            (user_id, db_media_id, media_type)
        )

        if cursor.rowcount == 0:
            print("No matching favorite found.")
            return False

        connection.commit()
        print("Favorite deleted successfully.")
        return True

    finally:
        connect.stop_connection(connection, cursor)


# Get limited favorites for a user
def get_user_favorites(user_id, limit=3):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return None

    try:
        cursor.execute(
            """
            SELECT fav_id, media_id, media_type
            FROM ADMIN.favorites
            WHERE user_id = :1
            FETCH FIRST :2 ROWS ONLY
            """,
            (user_id, limit)
        )

        rows = cursor.fetchall()
        return [
            {"fav_id": fav_id, "media_id": media_id, "media_type": media_type}
            for fav_id, media_id, media_type in rows
        ]

    finally:
        connect.stop_connection(connection, cursor)


# Check if user has favorited item
def is_favorited(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return False

    # Convert book string → numeric mapping
    if media_type == "book":
        cursor.execute("SELECT ADMIN.get_fav_book_id(:1) FROM DUAL", (media_id,))
        db_media_id = cursor.fetchone()[0]
    else:
        try:
            db_media_id = int(media_id)
        except ValueError:
            return False

    try:
        cursor.execute(
            """
            SELECT 1
            FROM ADMIN.favorites
            WHERE user_id = :1 AND media_id = :2 AND media_type = :3
            """,
            (user_id, db_media_id, media_type)
        )
        return cursor.fetchone() is not None

    finally:
        connect.stop_connection(connection, cursor)


# Get all favorites
def get_all_favorites():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        return None

    try:
        cursor.execute(
            """SELECT fav_id, user_id, media_id, media_type
               FROM ADMIN.favorites"""
        )
        rows = cursor.fetchall()
        return [
            {"fav_id": fav, "user_id": user, "media_id": mid, "media_type": t}
            for fav, user, mid, t in rows
        ]

    finally:
        connect.stop_connection(connection, cursor)


# Lookup original string ID from numeric book ID
def get_string_id_from_int(db_media_id: int):
    connection, cursor = connect.start_connection()
    if not connection:
        return None

    try:
        cursor.execute(
            "SELECT ADMIN.get_fav_book_str(:1) FROM DUAL",
            (db_media_id,)
        )
        row = cursor.fetchone()
        return row[0] if row else None

    finally:
        connect.stop_connection(connection, cursor)

