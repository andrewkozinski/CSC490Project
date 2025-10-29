import oracledb
# import connect


from database import connect


def get_new_list_id():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    cursor.execute("SELECT MAX(LIST_ID) FROM ADMIN.WATCHLIST")
    result = cursor.fetchone()

    connect.stop_connection(connection, cursor)
    if result and result[0] is not None:
        return result[0] + 1  # Add one to maximum existing vote id
    else:
        print("No watchlists found in the database.")
        return 0


def add_watchlist(user_id,media_id,media_type):
    connection, cursor = connect.start_connection()
    list_id = get_new_list_id()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            INSERT INTO ADMIN.WATCHLIST (LIST_ID,USER_ID,MEDIA_ID,MEDIA_TYPE)
            VALUES (:1, :2, :3, :4)
            """,
            (list_id,user_id,media_id,media_type)
        )
        connection.commit()
        print("Watchlist added successfully.")

        return list_id

    except oracledb.IntegrityError as e:
        # ORA-00001 occurs when a unique constraint is violated
        error_obj, = e.args
        if "ORA-00001" in error_obj.message:
            if "LIST_ID" in error_obj.message:  # PK
                print(f"Error: LIST_ID {list_id} already exists.")
        else:
            print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error inserting watchlist:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)


def delete_watchlist(list_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.WATCHLIST WHERE LIST_ID = :1
            """,
            (list_id,)
        )
        if cursor.rowcount == 0:  # nothing deleted
            print(f"Error: LIST_ID {list_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Watchlist with LIST_ID {list_id} deleted successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting watchlist:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

#Takes in a user id, media id and media type and returns the corresponding list id from the watchlist table
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

#Takes in a user id, media id and media type and deletes the corresponding watchlist entry
def delete_by_media_id_and_type(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.WATCHLIST 
            WHERE USER_ID = :1 AND MEDIA_ID = :2 AND MEDIA_TYPE = :3
            """,
            (user_id, media_id, media_type)
        )
        if cursor.rowcount == 0:  # nothing deleted
            print(f"Error: No watchlist entry found for USER_ID {user_id}, MEDIA_ID {media_id}, MEDIA_TYPE {media_type}.")
            return False
        else:
            connection.commit()
            print(f"Watchlist entry for USER_ID {user_id}, MEDIA_ID {media_id}, MEDIA_TYPE {media_type} deleted successfully.")
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

    try:
        cursor.execute(
            """
            SELECT 1
            FROM ADMIN.WATCHLIST
            WHERE USER_ID = :1 AND MEDIA_ID = :2 AND MEDIA_TYPE = :3
            """,
            (user_id, media_id, media_type)
        )
        result = cursor.fetchone()
        if result:
            return True
        else:
            return False

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error checking bookmark:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)