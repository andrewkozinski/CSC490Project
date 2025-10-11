import oracledb
#import connect

#MAJOR NOTE: This import is what works for both render (where the backend is hosted) and at least for me (andrew) locally
from database import connect #If this import doesn't work change it temporarily, but be sure to change it back before pushing because the backend won't understand "import connect" when it's on render

#from users import valid_user_id
from database.users import valid_user_id

def format_review(row):
    return {
        "review_id": row[0],
        "user_id": row[1],
        "media_id": row[2],
        "media_type": row[3],
        "rating": row[4],
        "review_text": row[5]
    }

def get_new_review_id():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    cursor.execute("SELECT MAX(REVIEW_ID) FROM ADMIN.REVIEWS")
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
            if media_type == "book":
                cursor.execute("SELECT ADMIN.get_book_id(:1) FROM dual", (media_id,))
                result = cursor.fetchone()
                db_media_id = result[0]
            else:
                db_media_id = int(media_id)

            cursor.execute(
                """
                INSERT INTO ADMIN.REVIEWS (REVIEW_ID, USER_ID, MEDIA_ID, MEDIA_TYPE, RATING, REVIEW_TEXT)
                VALUES (:1, :2, :3, :4, :5, :6)
                """,
                (review_id, user_id, db_media_id, media_type, rating, review_text)
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
            DELETE FROM ADMIN.REVIEWS WHERE REVIEW_ID = :1
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
    cursor.execute("SELECT * FROM ADMIN.REVIEWS")
    row = cursor.fetchall()
    if row:
        for row in row:
            print(row)
    else:
        print("No result")

def get_all_reviews():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute("SELECT * FROM ADMIN.REVIEWS")
        rows = cursor.fetchall()
        reviews = []
        for row in rows:
            review = {
                "review_id": row[0],
                "user_id": row[1],
                "media_id": row[2],
                "media_type": row[3],
                "rating": row[4],
                "review_text": row[5]
            }
            reviews.append(review)
        return reviews

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching reviews:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

#get all reviews by media type: book, tv shows, movies
def get_reviews_by_media_type(media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        cursor.execute("SELECT * FROM ADMIN.REVIEWS WHERE MEDIA_TYPE = :1", (media_type,))
        rows = cursor.fetchall()
        return rows
    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching reviews by media type:", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)

#gets all reviews for the media item. It finds all reviews that users have written for the specific item.
def get_reviews_by_media_id_and_type(media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        if media_type == "book":
            cursor.execute("SELECT ADMIN.get_book_id(:1) FROM dual", (media_id,))
            result = cursor.fetchone()
            db_media_id = result[0]
        else:
            db_media_id = media_id
        cursor.execute("SELECT * FROM ADMIN.REVIEWS WHERE MEDIA_ID = :1 AND MEDIA_TYPE = :2", (db_media_id, media_type))
        rows = cursor.fetchall()

        reviews = []
        for row in rows:
            review = format_review(row)
            reviews.append(review)
        return reviews
    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching reviews by media ID and type:", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)

#get reviews written by the user
def get_reviews_by_user_id(user_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        cursor.execute("SELECT * FROM ADMIN.REVIEWS WHERE USER_ID = :1", (user_id,))
        rows = cursor.fetchall()

        reviews = []

        #Format the reviews into a list of dictionaries for the front end to more easily access the data
        for row in rows:
            review = format_review(row)
            reviews.append(review)
        return reviews

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching reviews by user ID:", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)

#get all reviews by user id and media type.It finds all reviews that users have written for the specific item.
def get_reviews_by_user_id_and_media_type(user_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        cursor.execute("SELECT * FROM ADMIN.REVIEWS WHERE USER_ID = :1 AND MEDIA_TYPE = :2", (user_id,media_type))
        rows = cursor.fetchall()

        #Format reviews
        reviews = []
        for row in rows:
            review = format_review(row)
            reviews.append(review)
        return reviews

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching reviews by user ID and media type:", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)

#get reviews of the user for a specific item
def get_reviews_by_user_id_and_media_id_and_media_type(user_id, media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None
    try:
        if media_type == "book":
            cursor.execute("SELECT ADMIN.get_book_id(:1) FROM REVIEWS", (media_id,))
            result = cursor.fetchone()
            db_media_id = result[0]
        else:
            db_media_id = media_id
        cursor.execute("SELECT * FROM ADMIN.REVIEWS WHERE USER_ID = :1 AND MEDIA_ID = :2 AND MEDIA_TYPE = :3", (user_id,media_id, media_type))
        rows = cursor.fetchall()

        reviews = []
        for row in rows:
            review = format_review(row)
            reviews.append(review)
        return reviews

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching reviews by user ID and media ID and media_type:", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)

def edit_review(review_id, review_text):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            UPDATE ADMIN.REVIEWS
            SET REVIEW_TEXT = :1
            WHERE REVIEW_ID = :2
            """,
            (review_text, review_id)
        )

        if cursor.rowcount == 0:  # no rows updated
            print(f"Error: REVIEW_ID {review_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"REVIEW_TEXT for REVIEW_ID {review_id} updated successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error modifying review text:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)
