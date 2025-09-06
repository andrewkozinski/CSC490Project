from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World!"}

# Dictionary to simulate a database of movies
movies = {
        1: {"name": "Spiderverse 3", "director": "Never Coming Out", "year": 2099},
        2: {"name": "CSC 343: David Gerstl's Wild Ride", "director": "David Gerstl", "year": 2025},
        3: {"name": "Superman 2", "director": "James Gunn", "year": 2027}
    }

# Example of a path operation with a path parameter
# In actual practice, this would fetch an item from the database or fetch from whatever API we're working with.
@app.get("/movies/{movie_id}")
async def get_movie(movie_id):
    # Using a hashmap/dictionary here for simplicity
    # We'd actually fetch this from a database or some other data source
    #item dict of movies with their details
    return movies.get(movie_id, {"message": "movie not found"}) #return the item if found, otherwise return a not found message

# Post request example for adding a new item to the items dictionary
@app.post("/movies/")
async def add_movie(movie_title: str, movie_director: str, movie_year: int):
    new_id = max(movies.keys()) + 1 # Generate a new ID by incrementing the highest existing ID

    # Add the new movie to the movies dictionary with the new ID and provided details
    movies[new_id] = {
        "name": movie_title,
        "director": movie_director,
        "year": movie_year
    }
    return {"message": "movie added", "movie_id": new_id}