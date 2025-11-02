import oracledb
# import connect


from database import connect


def add_watchlist(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    if media_type == "book":
        cursor.execute("SELECT ADMIN.get_watchlist_book_id(:1) FROM DUAL", (media_id,))
        result = cursor.fetchone()
        db_media_id = result[0]
    else:
        try:
            db_media_id = int(media_id)
        except ValueError:
            print(f"Error: Non-book MEDIA_ID '{media_id}' is not a valid integer.")
            return False

    try:
        if not is_bookmarked(user_id, db_media_id, media_type):
            cursor.execute(
                """
                INSERT INTO ADMIN.WATCHLIST (USER_ID,MEDIA_ID,MEDIA_TYPE)
                VALUES (:1, :2, :3)
                """,
                (user_id, db_media_id, media_type)
            )
            connection.commit()
            print("Watchlist added successfully.")
            return True
        else:
            print("Watchlist item already exists.")
            return False

    except oracledb.Error as e:
        return False
    finally:
        connect.stop_connection(connection, cursor)


# Takes in a user id, media id and media type and returns the corresponding list id from the watchlist table
def get_list_id_from_media_type_and_id(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT LIST_ID
            FROM ADMIN.WATCHLIST
            WHERE USER_ID = :1 AND MEDIA_ID = :2 AND MEDIA_TYPE = :3
            """,
            (user_id, media_id, media_type)
        )
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            return None

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error retrieving LIST_ID:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)


# Takes in a user id, media id and media type and deletes the corresponding watchlist entry
def delete_by_media_id_and_type(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    if media_type == "book":
        try:
            cursor.execute("SELECT ADMIN.get_watchlist_book_id(:1) FROM DUAL", (media_id,))
            result = cursor.fetchone()
            db_media_id = result[0]
        except oracledb.Error as e:
            error_obj, = e.args
            print("Database error during book ID lookup for deletion:", error_obj.message)
            return False
    else:
        try:
            db_media_id = int(media_id)
        except ValueError:
            print(f"Error: Non-book MEDIA_ID '{media_id}' is not a valid integer.")
            return False

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.WATCHLIST 
            WHERE USER_ID = :1 AND MEDIA_ID = :2 AND MEDIA_TYPE = :3
            """,
            (user_id, db_media_id, media_type)
        )
        if cursor.rowcount == 0:
            print(
                f"Error: No watchlist entry found for USER_ID {user_id}, MEDIA_ID {media_id} ({media_type}).")
            return False
        else:
            connection.commit()
            print(
                f"Watchlist entry for USER_ID {user_id}, MEDIA_ID {media_id} ({media_type}) deleted successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting watchlist entry:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)


def get_user_watchlist(user_id, limit=3):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT LIST_ID, MEDIA_ID, MEDIA_TYPE
            FROM ADMIN.WATCHLIST
            WHERE USER_ID = :1
            FETCH FIRST :2 ROWS ONLY
            """,
            (user_id, limit)
        )
        results = cursor.fetchall()
        bookmarks = [
            {'list_id': list_id, 'media_id': media_id, 'media_type': media_type}
            for list_id, media_id, media_type in results
        ]
        return bookmarks

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error retrieving user bookmarks:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)


def is_bookmarked(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    if media_type == "book":
        try:
            cursor.execute("SELECT ADMIN.get_watchlist_book_id(:1) FROM DUAL", (media_id,))
            result = cursor.fetchone()
            db_media_id = result[0]
        except oracledb.Error as e:
            error_obj, = e.args
            print("Database error during book ID lookup:", error_obj.message)
            return False
    else:
        try:
            db_media_id = int(media_id)
        except ValueError:
            print(f"Error: Non-book MEDIA_ID '{media_id}' is not a valid integer for bookmark check.")
            return False

    try:
        cursor.execute(
            """
            SELECT 1
            FROM ADMIN.WATCHLIST
            WHERE USER_ID = :1 AND MEDIA_ID = :2 AND MEDIA_TYPE = :3
            """,
            (user_id, db_media_id, media_type)
        )
        result = cursor.fetchone()
        return bool(result)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error checking bookmark:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)


def get_all_bookmarks():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT LIST_ID, USER_ID, MEDIA_ID, MEDIA_TYPE
            FROM ADMIN.WATCHLIST
            """
        )
        results = cursor.fetchall()
        bookmarks = [
            {'list_id': list_id, 'user_id': user_id, 'media_id': media_id, 'media_type': media_type}
            for list_id, user_id, media_id, media_type in results
        ]
        return bookmarks

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error retrieving all bookmarks:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)
