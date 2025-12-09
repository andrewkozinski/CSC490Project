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
    },
    "recommendations": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 600, #10 minutes
    },
    "is_favorited": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 3600, #1 hour
    },
    "user_favorites": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 300, #5 minutes
    },
    "recent_reviews": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 3600, #5 minutes
    },
    "comments": {
        "cache": "aiocache.SimpleMemoryCache",
        "ttl": 3600, #1 hour
    },
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
from routes.notifications import router as notifications_router
from routes.recommendations import router as recommendations_router
from routes.blocking import router as blocking_router
from routes.settings import router as settings_router
from routes.favorites import router as favorites_router
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

# Routes from routes directory
app.include_router(auth_router, prefix="/auth", tags=["authentication"]) #includes the API router from routes/auth.py
app.include_router(movies_router, prefix="/movies", tags=["movies"]) #includes the API router from routes/movies.py
app.include_router(tv_router, prefix="/tvshows", tags=["tvshows"]) #includes the API router from routes/tvshows.py
app.include_router(book_router, prefix="/books", tags=["books"]) #includes the API router from routes/books.py
app.include_router(review_router, prefix="/reviews", tags=["reviews"]) #includes the API router from routes/reviews.py
app.include_router(search_router, prefix="/search", tags=["search"]) #includes the API router from routes/search.py
app.include_router(profiles_router, prefix="/profiles", tags=["profiles"]) #includes the API router from routes/profiles.py
app.include_router(comments_router, prefix="/comments", tags=["comments"]) #includes the API router from routes/comments.py
app.include_router(votes_router, prefix="/votes", tags=["votes"]) #includes the API router from routes/upvotes.py
app.include_router(follow_router, prefix="/follow", tags=["follow"]) #includes the API router from routes/follow.py
app.include_router(bookmarks_router, prefix="/bookmarks", tags=["bookmarks"]) #includes the API router from routes/bookmarks.py
app.include_router(notifications_router, prefix="/notifications", tags=["notifications"]) #includes the API router from routes/notifications.py
app.include_router(recommendations_router, prefix="/recommendations", tags=["recommendations"]) #includes the API router from routes/recommendations.py
app.include_router(blocking_router, prefix="/blocking", tags=["blocking"]) #includes the API router from routes/blocking.py
app.include_router(settings_router, prefix="/settings", tags=["settings"]) #includes the API router from routes/settings.py
app.include_router(favorites_router, prefix="/favorites", tags=["favorites"]) #includes the API router from routes/favorites.py

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
