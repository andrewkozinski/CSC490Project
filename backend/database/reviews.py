import oracledb
import connect
from users import valid_user_id


def get_new_review_id():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    cursor.execute("SELECT MAX(REVIEW_ID) FROM REVIEWS")
    result = cursor.fetchone()

    connect.stop_connection(connection, cursor)
    if result and result[0] is not None:
        return result[0] + 1 # Add one to maximum existing review id
    else:
        print("No reviews found in the database.")
        return 0

def add_review(user_id, media_id, media_type, rating, review_text):
    connection, cursor = connect.start_connection()
    review_id = get_new_review_id()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    if valid_user_id(user_id):
        try:
            cursor.execute(
                """
                INSERT INTO REVIEWS (REVIEW_ID, USER_ID, MEDIA_ID, MEDIA_TYPE, RATING, REVIEW_TEXT)
                VALUES (:1, :2, :3, :4, :5, :6)
                """,
                (review_id, user_id, media_id, media_type, rating, review_text)
            )
            connection.commit()
            print("Review added successfully.")
            # Return the new user ID
            return review_id

        except oracledb.IntegrityError as e:
            # ORA-00001 occurs when a unique constraint is violated
            error_obj, = e.args
            if "ORA-00001" in error_obj.message:
                if "REVIEW_ID" in error_obj.message: # PK
                    print(f"Error: REVIEW_ID {review_id} already exists.")
            else:
                print("Integrity error:", error_obj.message)

        except oracledb.Error as e:
            error_obj, = e.args
            print("Database error inserting review:", error_obj.message)

        finally:
            connect.stop_connection(connection, cursor)
    else:
        print(f"User with USER_ID {user_id} does not exist.")
        return None

def delete_review(review_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return

    try:
        cursor.execute(
            """
            DELETE FROM REVIEWS WHERE REVIEW_ID = :1
            """,
            (review_id,)
        )
        if cursor.rowcount == 0:  # nothing deleted
            print(f"Error: REVIEW_ID {review_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Review with REVIEW_ID {review_id} deleted successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting review:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def print_reviews():
    connection, cursor = connect.start_connection()
    cursor.execute("SELECT * FROM REVIEWS")
    row = cursor.fetchall()
    if row:
        for row in row:
            print(row)
    else:
        print("No result")

#print_reviews()
#add_review(4,1,"a",5,"")
#print_reviews()
#delete_review(1)
#print_reviews()