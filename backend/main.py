import os
from fastapi import FastAPI
from routes.movies import router as movies_router
from routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()

# Base route to test if the server is running
@app.get("/")
async def root():
    return {"message": "Hello World!"}

# Dictionary to simulate a database of movies
movies = {
        1: {"name": "Spiderverse 3", "director": "Never Coming Out", "year": 2099},
        2: {"name": "CSC 343: David Gerstl's Wild Ride", "director": "David Gerstl", "year": 2025},
        3: {"name": "Superman 2", "director": "James Gunn", "year": 2027}
    }

# Get all movies in the movies dictionary
#@app.get("/movies/all")
#async def get_all_movies():
#    return movies

# Example of a path operation with a path parameter
# In actual practice, this would fetch an item from the database or fetch from whatever API we're working with.
@app.get("/example/movies/{movie_id}")
async def get_movie(movie_id: int):
    # We'd actually fetch this from a database or some other data source,
    # but for this example, we're just using a dict/hashmap to emulate that
    # return the item if found, otherwise return a not found message
    return movies.get(movie_id, {"message": "movie not found"})

# Post request example for adding a new item to the items dictionary
@app.post("/example/movies/add")
async def add_movie(movie_title: str, movie_director: str, movie_year: int):
    new_id = max(movies.keys()) + 1 # Generate a new ID by incrementing the highest existing ID

    # Add the new movie to the movies dictionary with the new ID and provided details
    movies[new_id] = {
        "name": movie_title,
        "director": movie_director,
        "year": movie_year
    }
    return {"message": "movie added", "movie_id": new_id}

# Routes from routes directory
app.include_router(movies_router, prefix="/movies") #includes the API router from routes/movies.py
app.include_router(auth_router, prefix="/auth") #includes the API router from routes/auth.py

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
