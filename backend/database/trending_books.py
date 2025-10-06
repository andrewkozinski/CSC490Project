import oracledb
import connect
from reviews import add_review

def get_top_books_reviewed():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT MEDIA_ID, COUNT(*) AS REVIEW_COUNT
            FROM REVIEWS
            WHERE MEDIA_TYPE = 'book'
            GROUP BY MEDIA_ID
            ORDER BY COUNT(*) DESC
            FETCH FIRST 15 ROWS ONLY
            """
        )
        results = cursor.fetchall()

        books_count = []
        for media_id, review_count in results:
            cursor.execute("SELECT ADMIN.get_book_str(:1) FROM dual", (media_id,))
            book_results = cursor.fetchone()
            original_book_id = book_results[0] if book_results else None

            books_count.append({
                'book_id': original_book_id,
                'review_count': review_count
            })
        return books_count

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error while retrieving top books:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)