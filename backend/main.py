import os
from contextlib import asynccontextmanager

from aiocache import caches, Cache, cached
#Initializes aiocache configuration
#Needs to be up here because needs to run before any of the other imports that use caching
caches.set_config({
    "default": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 300, #5 minutes
    },
    "user_bookmarks": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 300, #5 minutes
    },
    "is_bookmarked": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 3600, #1 hour
    },
    "reviews": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 300, #5 minutes
    },
    "user_votes": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 3600, #1 hour
    },
    "profiles": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 3600, #1 hour
    }


})

from fastapi import FastAPI
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from routes.movies import router as movies_router
from routes.auth import router as auth_router
from routes.tvshows import router as tv_router
from routes.books import router as book_router
from routes.reviews import router as review_router
from routes.search import router as search_router
from routes.profiles import router as profiles_router
from routes.comments import router as comments_router
from routes.votes import router as votes_router
from routes.follow import router as follow_router
from routes.bookmarks import router as bookmarks_router
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This initializes cache
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")
    yield

app = FastAPI(lifespan=lifespan)

# Base route to test if the server is running
@app.get("/")
async def root():
    return {"message": "Hello World!"}

# # Dictionary to simulate a database of movies
# movies = {
#         1: {"name": "Spiderverse 3", "director": "Never Coming Out", "year": 2099},
#         2: {"name": "CSC 343: David Gerstl's Wild Ride", "director": "David Gerstl", "year": 2025},
#         3: {"name": "Superman 2", "director": "James Gunn", "year": 2027}
#     }
#
# # Get all movies in the movies dictionary
# #@app.get("/movies/all")
# #async def get_all_movies():
# #    return movies
#
# # Example of a path operation with a path parameter
# # In actual practice, this would fetch an item from the database or fetch from whatever API we're working with.
# @app.get("/example/movies/{movie_id}")
# async def get_movie(movie_id: int):
#     # We'd actually fetch this from a database or some other data source,
#     # but for this example, we're just using a dict/hashmap to emulate that
#     # return the item if found, otherwise return a not found message
#     return movies.get(movie_id, {"message": "movie not found"})
#
# # Post request example for adding a new item to the items dictionary
# @app.post("/example/movies/add")
# async def add_movie(movie_title: str, movie_director: str, movie_year: int):
#     new_id = max(movies.keys()) + 1 # Generate a new ID by incrementing the highest existing ID
#
#     # Add the new movie to the movies dictionary with the new ID and provided details
#     movies[new_id] = {
#         "name": movie_title,
#         "director": movie_director,
#         "year": movie_year
#     }
#     return {"message": "movie added", "movie_id": new_id}

# Routes from routes directory
app.include_router(auth_router, prefix="/auth") #includes the API router from routes/auth.py
app.include_router(movies_router, prefix="/movies") #includes the API router from routes/movies.py
app.include_router(tv_router, prefix="/tvshows") #includes the API router from routes/tvshows.py
app.include_router(book_router, prefix="/books") #includes the API router from routes/books.py
app.include_router(review_router, prefix="/reviews") #includes the API router from routes/reviews.py
app.include_router(search_router, prefix="/search") #includes the API router from routes/search.py
app.include_router(profiles_router, prefix="/profiles") #includes the API router from routes/profiles.py
app.include_router(comments_router, prefix="/comments") #includes the API router from routes/comments.py
app.include_router(votes_router, prefix="/votes") #includes the API router from routes/upvotes.py
app.include_router(follow_router, prefix="/follow") #includes the API router from routes/follow.py
app.include_router(bookmarks_router, prefix="/bookmarks") #includes the API router from routes/bookmarks.py

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
