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
