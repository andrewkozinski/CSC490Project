import oracledb
#import connect
from database import connect
from database.user_vote import delete_all_user_vote

def get_new_vote_id():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    cursor.execute("SELECT MAX(VOTE_ID) FROM ADMIN.VOTE")
    result = cursor.fetchone()

    connect.stop_connection(connection, cursor)
    if result and result[0] is not None:
        return result[0] + 1 # Add one to maximum existing vote id
    else:
        print("No votes found in the database.")
        return 0

def add_vote(review_id, comment_id, upvotes, downvotes):
    connection, cursor = connect.start_connection()
    vote_id = get_new_vote_id()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            INSERT INTO ADMIN.VOTE (VOTE_ID, REVIEW_ID, COMMENT_ID, UPVOTES, DOWNVOTES)
            VALUES (:1, :2, :3, :4, :5)
            """,
            (vote_id, review_id, comment_id, upvotes, downvotes)
        )
        connection.commit()
        print("Vote added successfully.")

        return vote_id

    except oracledb.IntegrityError as e:
        # ORA-00001 occurs when a unique constraint is violated
        error_obj, = e.args
        if "ORA-00001" in error_obj.message:
            if "VOTE_ID" in error_obj.message: # PK
                print(f"Error: VOTE_ID {vote_id} already exists.")
        else:
            print("Integrity error:", error_obj.message)

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error inserting vote:", error_obj.message)

    finally:
        connect.stop_connection(connection, cursor)

def delete_vote(vote_id): # singular vote
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.VOTE WHERE VOTE_ID = :1
            """,
            (vote_id,)
        )
        if cursor.rowcount == 0:  # nothing deleted
            print(f"Error: VOTE_ID {vote_id} does not exist.")
            return False
        else:
            delete_all_user_vote(vote_id)
            connection.commit()
            print(f"Vote with VOTE_ID {vote_id} deleted successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting review:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def delete_review_vote(review_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    try:
        cursor.execute( # retrieve vote_id to delete user votes from
            """
            SELECT VOTE_ID FROM ADMIN.VOTE WHERE REVIEW_ID = :1
            """,
            (review_id,)
        )
        vote_id = cursor.fetchone()[0]
        delete_all_user_vote(vote_id)

        cursor.execute(
            """
            DELETE FROM ADMIN.VOTE WHERE REVIEW_ID = :1
            """,
            (review_id,)
        )
        if cursor.rowcount == 0:  # nothing deleted
            print(f"Error: REVIEW_ID {review_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Vote with REVIEW_ID {review_id} deleted successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting review:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def delete_comment_vote(comment_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return False

    try:
        cursor.execute(
            """
            DELETE FROM ADMIN.VOTE WHERE COMMENT_ID = :1
            """,
            (comment_id,)
        )
        if cursor.rowcount == 0:  # nothing deleted
            print(f"Error: COMMENT_ID {comment_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Vote with COMMENT_ID {comment_id} deleted successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error deleting review:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def get_vote_by_review_id(review_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT * FROM ADMIN.VOTE
            WHERE REVIEW_ID = :1
            """,
            (review_id,)
        )
        rows = cursor.fetchall()
        votes = []
        for row in rows:
            vote = {
                "vote_id": row[0],
                "review_id": row[1],
                "comment_id": row[2],
                "upvotes": row[3],
                "downvotes": row[4]
            }
            votes.append(vote)
        return votes

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching reviews by vote id:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

def get_vote_by_comment_id(comment_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT * FROM ADMIN.VOTE
            WHERE COMMENT_ID = :1
            """,
            (comment_id,)
        )
        rows = cursor.fetchall()
        votes = []
        for row in rows:
            vote = {
                "vote_id": row[0],
                "review_id": row[1],
                "comment_id": row[2],
                "upvotes": row[3],
                "downvotes": row[4]
            }
            votes.append(vote)
        return votes

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching comments by vote id:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

def increment_upvote(vote_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            UPDATE ADMIN.VOTE
            SET UPVOTES = UPVOTES + 1
            WHERE VOTE_ID = :1
            """,
            (vote_id,)
        )

        if cursor.rowcount == 0:  # nothing updated
            print(f"Error: VOTE_ID {vote_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Upvote for VOTE_ID {vote_id} increased successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error increasing upvote:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def decrement_upvote(vote_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            UPDATE ADMIN.VOTE
            SET UPVOTES = UPVOTES - 1
            WHERE VOTE_ID = :1
            """,
            (vote_id,)
        )

        if cursor.rowcount == 0:  # nothing updated
            print(f"Error: VOTE_ID {vote_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Upvote for VOTE_ID {vote_id} decreased successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error decreasing upvote:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def increment_downvote(vote_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            UPDATE ADMIN.VOTE
            SET DOWNVOTES = DOWNVOTES + 1
            WHERE VOTE_ID = :1
            """,
            (vote_id,)
        )

        if cursor.rowcount == 0:  # nothing updated
            print(f"Error: VOTE_ID {vote_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Downvote for VOTE_ID {vote_id} increased successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error increasing downvote:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def decrement_downvote(vote_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            UPDATE ADMIN.VOTE
            SET DOWNVOTES = DOWNVOTES - 1
            WHERE VOTE_ID = :1
            """,
            (vote_id,)
        )

        if cursor.rowcount == 0:  # nothing updated
            print(f"Error: VOTE_ID {vote_id} does not exist.")
            return False
        else:
            connection.commit()
            print(f"Downvote for VOTE_ID {vote_id} decreased successfully.")
            return True

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error decreasing downvote:", error_obj.message)
        return False

    finally:
        connect.stop_connection(connection, cursor)

def get_vote_id_by_review_and_comment_id(review_id, comment_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        if comment_id is None:
            cursor.execute(
                """
                SELECT VOTE_ID FROM ADMIN.VOTE
                WHERE REVIEW_ID = :1 AND COMMENT_ID IS NULL
                """,
                (review_id,)
            )
        else:
            cursor.execute(
                """
                SELECT VOTE_ID FROM ADMIN.VOTE
                WHERE REVIEW_ID = :1 AND COMMENT_ID = :2
                """,
                (review_id, comment_id)
            )

        result = cursor.fetchone()
        if result:
            return result[0]  # Return the vote_id
        else:
            return None  # No matching record found

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching vote id:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

def get_all_votes():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT * FROM ADMIN.VOTE
            """
        )
        rows = cursor.fetchall()
        votes = []
        for row in rows:
            vote = {
                "vote_id": row[0],
                "review_id": row[1],
                "comment_id": row[2],
                "upvotes": row[3],
                "downvotes": row[4]
            }
            votes.append(vote)
        return votes

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error fetching all votes:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)

