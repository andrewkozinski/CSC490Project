import oracledb
import connect

#get the average ratings of movies, tv shows and books by media id
def get_avg_rating(media_id):
    connection, cursor = connect.start_connection()
    if not connection or not cursor:
        print("Failed to connect to database")
        return None

    try:
        cursor.execute(
            """
            SELECT AVG(rating) AS avg_rating
            FROM REVIEWS
                WHERE media_id = :1
            """,
            (media_id,)
        )
        result = cursor.fetchone()

        if result and result[0] is None:
            return round(float(result[0]), 1)
        else:
            return None
    except oracledb.Error as e:
        error_obj = e.args
        print("Database error while getting average rating", error_obj.message)
        return None
    finally:
        connect.stop_connection(connection, cursor)