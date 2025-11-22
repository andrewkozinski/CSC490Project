from fastapi import APIRouter, HTTPException
from typing import Optional
from routes import movies, tvshows, books
from routes import reviews as review_routes
#from models import book, movie, tvshow
from aiocache import cached, Cache, caches
#from database import trending_books, ratings, reviews

router = APIRouter()

async def _general_recommendations(media_type: str, limit: int = 20):
    if media_type == "book":
        return await books.get_trending_books()
    elif media_type == "movie":
        return await movies.get_trending_movies(limit)
    elif media_type == "tvshow":
        return await tvshows.get_trending_tvshows(limit)
    else:
        raise HTTPException(status_code=500, detail=f"No recommendation backend available for media type of: {media_type}")

async def _personal_recommendations(media_type: str, user_id: int, limit: int = 20):
    #user_reviews = reviews.get_reviews_by_user_id(user_id)
    user_reviews = await review_routes.get_recent_reviews_by_user_id(user_id, limit=50)
    user_reviews = user_reviews["reviews"]

    #If no reviews, fallback to general recommendations
    if not user_reviews or len(user_reviews) == 0:
        return await _general_recommendations(media_type, limit)

    #Get the genres of reviews above 3 stars
    preferred_genres = set()
    for review in user_reviews:
        if review["rating"] >= 3:
            try:
                if media_type == "book" and review["media_type"] == "books":
                    book_details = await books.get_book_details(review["media_id"])
                    preferred_genres.update(book_details.categories)
                elif media_type == "movie" and review["media_type"] == "movies":
                    movie_details = await movies.get_movie(review["media_id"])
                    if movie_details and movie_details.genre:
                        preferred_genres.update(movie_details.genre)
                elif media_type == "tvshow" and review["media_type"] == "tv":
                    tvshow_details = await tvshows.get_tvshow(review["media_id"])
                    if tvshow_details and tvshow_details.genre:
                        preferred_genres.update(tvshow_details.genre)
            except Exception as e:
                #Just skip any errors in fetching details
                print(f"Error fetching details for review {review['media_id']}: {str(e)}")
                continue

    if preferred_genres:
        if media_type == "book":
            recommended_books = []
            for genre in preferred_genres:
                try:
                    print("Fetching books for genre:", genre)
                    genre_books = await books.get_books_by_genre(genre)
                    #Only add a certain amount from each genre to avoid overfilling
                    num_book_to_add_per_genre = max(1, limit // len(preferred_genres))
                    recommended_books.extend(genre_books["results"][:num_book_to_add_per_genre])
                    if len(recommended_books) >= limit:
                        break
                except Exception as e:
                    print(f"Error fetching books for genre {genre}: {str(e)}")
                    continue
            return recommended_books[:limit]
        elif media_type == "movie":
            recommended_movies = []
            for genre in preferred_genres:
                genre_movies = await movies.search_movies_by_genre(genre, page=1)
                #Only add a certain amount from each genre to avoid overfilling
                num_movies_to_add_per_genre = max(1, limit // len(preferred_genres))
                recommended_movies.extend(genre_movies['results'][:num_movies_to_add_per_genre])
                if len(recommended_movies) >= limit:
                    break
                #recommended_movies.extend(genre_movies['results'])
            return recommended_movies[:limit]
        elif media_type == "tvshow":
            recommended_tvshows = []
            for genre in preferred_genres:
                genre_tvshows = await tvshows.search_tvshows_by_genre(genre, page=1)
                #Only add a certain amount from each genre to avoid overfilling
                num_tvshows_to_add_per_genre = max(1, limit // len(preferred_genres))
                recommended_tvshows.extend(genre_tvshows['results'][:num_tvshows_to_add_per_genre])
                if len(recommended_tvshows) >= limit:
                    break
                #recommended_tvshows.extend(genre_tvshows['results'])
            return recommended_tvshows[:limit]

    #If somehow here, then fallback to general recommendations
    return await _general_recommendations(media_type, limit)


@router.get("/books", summary="Get book recommendations")
@cached(ttl=600, cache=Cache.MEMORY, alias="recommendations", key_builder=lambda f, *args, **kwargs: f"recommend_books_{kwargs.get('limit',20)}_{kwargs.get('user_id','none')}")
async def recommend_books(limit: int = 20, user_id: Optional[int] = None):
    if user_id is not None:
        return await _personal_recommendations("book", user_id, limit)
    return await _general_recommendations("book", limit)


@router.get("/movies", summary="Get movie recommendations")
@cached(ttl=600, cache=Cache.MEMORY, alias="recommendations", key_builder=lambda f, *args, **kwargs: f"recommend_movies_{kwargs.get('limit',20)}_{kwargs.get('user_id','none')}")
async def recommend_movies(limit: int = 20, user_id: Optional[int] = None):
    if user_id is not None:
        return await _personal_recommendations("movie", user_id, limit)
    return await _general_recommendations("movie", limit)


@router.get("/tvshows", summary="Get TV show recommendations")
@cached(ttl=600, cache=Cache.MEMORY, alias="recommendations", key_builder=lambda f, *args, **kwargs: f"recommend_tvshows_{kwargs.get('limit',20)}_{kwargs.get('user_id','none')}")
async def recommend_tvshows(limit: int = 20, user_id: Optional[int] = None):
    if user_id is not None:
        return await _personal_recommendations("tvshow", user_id, limit)
    return await _general_recommendations("tvshow", limit)