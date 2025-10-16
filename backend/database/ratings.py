import oracledb
#import connect
from database import connect #This import is what works for both render (where the backend is hosted) and at least for me (andrew) locally
#If this import doesn't work change it temporarily, but be sure to change it back before pushing because the backend won't understand "import connect" when it's on render

#get the average ratings of movies, tv shows by media id and media type
def get_avg_rating(media_id, media_type):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database")
        return None

    try:
        cursor.execute(
            """
            SELECT AVG(rating) AS avg_rating
            FROM ADMIN.REVIEWS
                WHERE media_id = :1 AND media_type = :2
            """,
            (media_id,media_type)
        )
        result = cursor.fetchone()

        if result and result[0] is not None:
            return round(result[0])
        else:
            return None
    except oracledb.Error as e:
        error_obj = e.args
        print("Database error while getting average rating", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)


#get average rating for books
def get_avg_ratings_by_book_id(book_id_str):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database")
        return None
    try:
        cursor.execute( "SELECT ADMIN.get_book_id(:1) FROM dual", (book_id_str,))
        result = cursor.fetchone()
        if not result or result[0] is None:
            print(f"Book ID '{book_id_str}' is not found")
            return None
        media_id = result[0]
        return get_avg_rating(media_id, "book")

    except oracledb.Error as e:
        error_obj = e.args
        print("Database error while getting average rating",error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)


#get average rating for movies
def get_avg_ratings_by_movie_id(movie_id):
    return get_avg_rating(int(movie_id), "movie")

#get average rating for tv shows
def get_avg_ratings_by_tv_id(tv_id):
    return get_avg_rating(int(tv_id), "tvshow")

