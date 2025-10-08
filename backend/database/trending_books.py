import oracledb
import connect

#get the first 15 books with the most reviews
def get_top_books_reviewed():
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database.")
        return None

    try:
        cursor.execute(
            """
            SELECT b.BOOK_STR, COUNT(*) AS REVIEWS_COUNT
            FROM REVIEWS r
                JOIN BOOKID_MAPPING b ON r.MEDIA_ID = b.BOOK_ID
                WHERE r.MEDIA_TYPE = 'book'
                GROUP BY b.BOOK_STR
                ORDER BY COUNT(*) DESC
                FETCH FIRST 15 ROWS ONLY
            """
        )
        results = cursor.fetchall()

        books_count = [
            {'book_id': book_str, 'reviews_count': reviews_count}
            for book_str, reviews_count in results
        ]
        return books_count

    except oracledb.Error as e:
        error_obj, = e.args
        print("Database error while retrieving top books:", error_obj.message)
        return None

    finally:
        connect.stop_connection(connection, cursor)