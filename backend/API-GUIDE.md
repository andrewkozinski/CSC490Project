# Backend API Routes Guide

This guide provides an overview of the available API routes in the backend. Each route is defined in its respective file under `backend/routes/`.

## Authentication (`auth.py`)
- **POST auth/login**: Authenticate a user and return a token.
- **POST auth/register**: Register a new user.

## Books (`books.py`)
- **GET books/search** : Search for books by title.
- **GET books/{book_id}**: Get detailed information about a specific book by its Google Books API ID.

## Movies (`movies.py`)
- **GET movies/search** : Search for movies by title.
- **GET movies/search/detailed** : Search for movies by title and return the raw API response from TMDB.
- **GET movies/genre/{genre_id}** : Get a list of movies by genre using the TMDB genre ID.
- **GET movies/{movie_id}** : Get detailed information about a specific movie by its TMDB API ID.

## TV Shows (`tvshows.py`)
- **GET tvshows/search**: Search for TV shows by title.
- **GET tvshows/search/detailed**: Search for TV shows by title and return the raw API response from TMDB.
- **GET tvshows/genre/{genre_id}**: Get a list of TV shows by genre using the TMDB genre ID.
- **GET tvshows/{tvshow_id}**: Get detailed information about a specific TV show by its TMDB API ID.
- **GET tvshows/detailed/{tvshow_id}**: Get detailed information about a specific TV show by its TMDB API ID and return the raw API response from TMDB.

---


## What each media type (book, movie, tv show) returns:

### Books:
A book object typically includes:
- `id`: ID associated with the book in Google Books API
- `title`: Book title
- `description`: Brief summary
- `authors`: List of authors, returned as a list of strings
- `date_published`: Date book was published
- `categories`: List of categories/genres, returned as a list of strings
- `page_count`: Number of pages
- `thumbnailURL`: URL to a thumbnail image of the book cover (standard size)
- `thumbnailExtraLargeURL`: URL to a larger thumbnail image of the book cover (largest size Google Books API provides)
- `isbn_10`: ISBN-10 identifier (if available)
- `isbn_13`: ISBN-13 identifier (if available)


### Movies:
A movie object typically includes:
- `id`: ID associated with the Movie in TMDB API
- `title`: Movie title
- `genre`: Genre(s) of the movie
- `director`: Director name
- `release_date`: Release date of the movie
- `overview`: Brief summary of the movie
- `img`: URL to a poster image of the movie

LIST OF GENRES SUPPORT BY THE API:
(id to name mapping)

    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"


### TV Shows:
A TV show object typically includes:
- `id`: ID associated with the TV Show in TMDB API
- `title`: TV show title
- `genre`: Genre(s) of the show. Note: API may return it as an empty list if not available.
- `created_by`: Creator name(s)
- `release_date`: First air date of the show
- `seasons`: Number of seasons
- `episodes`: Number of episodes
- `img`: URL to a poster image of the TV show

LIST OF GENRES SUPPORT BY THE API:
(id to name mapping)

    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap"

For more details, refer to the respective route files, use the FastAPI docs to test the routes, or contact anyone working on the backend. 