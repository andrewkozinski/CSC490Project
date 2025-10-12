from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv
from models.movie import Movie
from database.ratings import get_avg_ratings_by_movie_id

router = APIRouter()

load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

#Mapping of streaming providers to their URLs
#TMDB does not provide direct links unfortunately
STREAMING_LINKS = {
            "Netflix": "https://www.netflix.com/",
            "Amazon Prime Video": "https://www.primevideo.com/",
            "Amazon Prime Video with Ads": "https://www.primevideo.com",
            "Disney Plus": "https://www.disneyplus.com/",
            "Apple TV Plus": "https://tv.apple.com/",
            "YouTube": "https://www.youtube.com/movies",
            "Hulu": "https://www.hulu.com/",
            "Fandango At Home": "https://athome.fandango.com/content/browse/home",
            "Fandango at Home Free": "https://athome.fandango.com/content/browse/home",
            "Apple TV": "https://tv.apple.com/",
            "Paramount Plus": "https://www.paramountplus.com/",
            "Paramount Plus Apple TV Channel": "https://tv.apple.com/",
            "Paramount Plus Apple TV Channel ": "https://tv.apple.com/",
            "Paramount+ with Showtime": "https://www.paramountpluswithshowtime.com/",
            "Paramount+ Roku Premium Channel": "https://channelstore.roku.com/details/f04a1a2ece7f9ca611a97c045569cb9d:6e3fc82e82aae31af5401e62f222d1b1/paramount-plus",
            "HBO Max": "https://www.hbomax.com/",
            "Amazon Video": "https://www.amazon.com/gp/video/storefront",
            "Google Play Movies": "https://play.google.com/store/movies",
            "Tubi TV": "https://tubitv.com/",
            "Peacock": "https://www.peacocktv.com/",
            "fuboTV": "https://www.fubo.tv/",
            "MGM+ Amazon Channel": "https://www.amazon.com/gp/video/channel/1cd832b6-c298-4106-b4ff-dc9ce63304ea"
        }


# A movie response has a genre id list, we need to map those ids to genre names
# Usually, to grab this information you'd need the following:
# "https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}"
GENRE_ID_TO_NAME = {
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
}

GENRE_NAME_TO_ID = {
    "action": 28,
    "adventure": 12,
    "animation": 16,
    "comedy": 35,
    "crime": 80,
    "documentary": 99,
    "drama": 18,
    "family": 10751,
    "fantasy": 14,
    "history": 36,
    "horror": 27,
    "music": 10402,
    "mystery": 9648,
    "romance": 10749,
    "science fiction": 878,
    "sci-fi": 878, #allow sci-fi as well
    "tv movie": 10770,
    "thriller": 53,
    "war": 10752,
    "western": 37
}

#Returns movie information in the Movie model format
@router.get("/search")
async def search_movies(query: str, page: int = 1):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        movies = []
        for item in data.get('results', []):

            #Get director information from the movie details endpoint
            credits_url = f"https://api.themoviedb.org/3/movie/{item['id']}/credits?api_key={TMDB_API_KEY}"
            credits_response = await client.get(credits_url)
            if credits_response.status_code != 200:
                continue  # Skip if we can't get credits
            credits_details = credits_response.json()
            director = next((member for member in credits_details['crew'] if member['job'] == 'Director'), None)

            movie = Movie(
                id=str(item['id']),
                title=item['title'],
                genre=[GENRE_ID_TO_NAME.get(genre_id, "Unknown") for genre_id in item.get('genre_ids', [])],
                director=director['name'] if director else "Unknown",
                year=item['release_date'].split('-')[0] if item.get('release_date') else "Unknown",
                release_date=item.get('release_date', "N/A"),
                overview=item.get('overview', "No overview available."),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else ""
            )
            movies.append(movie)

        return {
            "page": data.get('page', 1),
            "total_results": data.get('total_results', 0),
            "total_pages": data.get('total_pages', 1),
            "results": movies
        }

# Detailed search that returns the full JSON response from TMDB
@router.get("/search/detailed")
async def search_movies_detailed(query: str, page: int = 1):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

#Search by genre
@router.get("/search/genre/{genre_name}")
async def search_movies_by_genre(genre_name: str, page: int = 1):
    # Find the genre ID from the name

    #genre_id = next((id for id, name in GENRE_ID_TO_NAME.items()
    #                if name.lower() == genre_name.lower()), None)

    #Use the genre_name_to_id dictionary to get the genre id
    genre_id = GENRE_NAME_TO_ID.get(genre_name.lower())

    if genre_id is None:
        raise HTTPException(status_code=400, detail="Invalid genre name")
    url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_genres={genre_id}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()


        movies = []
        for item in data.get('results', []):

            #Get director information from the movie details endpoint
            credits_url = f"https://api.themoviedb.org/3/movie/{item['id']}/credits?api_key={TMDB_API_KEY}"
            credits_response = await client.get(credits_url)
            if credits_response.status_code != 200:
                continue  # Skip if we can't get credits
            credits_details = credits_response.json()
            director = next((member for member in credits_details['crew'] if member['job'] == 'Director'), None)

            movie = Movie(
                id=str(item['id']),
                title=item['title'],
                genre=[GENRE_ID_TO_NAME.get(genre_id, "Unknown") for genre_id in item.get('genre_ids', [])],
                director=director['name'] if director else "Unknown",
                year=item['release_date'].split('-')[0] if item.get('release_date') else "Unknown",
                release_date=item.get('release_date', "N/A"),
                overview=item.get('overview', "No overview available."),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else ""
            )
            movies.append(movie)

        return {
            "page": data.get('page', 1),
            "total_results": data.get('total_results', 0),
            "total_pages": data.get('total_pages', 1),
            "results": movies
        }

#Search by genre and title
@router.get("/search/genre/{genre}/{title}")
async def search_tvshows_by_genre_and_title(genre: str, title: str, page: int = 1):
    # Use the search movie by title function first

    search_results = await search_movies(title, page)
    # Filter the results by genre
    filtered_results = [movie for movie in search_results['results'] if genre.lower() in [g.lower() for g in movie.genre]]

    return {
        "page": search_results['page'],
        "total_results": len(filtered_results),
        "total_pages": (len(filtered_results) // 20) + 1,
        "results": filtered_results
    }

#Get trending movies from the TMDB API
@router.get("/search/trending")
async def get_trending_movies(page: int = 1):
    url = f"https://api.themoviedb.org/3/trending/movie/week?api_key={TMDB_API_KEY}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        movies = []
        for item in data.get('results', []):

            #Get director information from the movie details tmdb route
            credits_url = f"https://api.themoviedb.org/3/movie/{item['id']}/credits?api_key={TMDB_API_KEY}"
            credits_response = await client.get(credits_url)
            if credits_response.status_code != 200:
                continue  # Skip if we can't get credits
            credits_details = credits_response.json()
            director = next((member for member in credits_details['crew'] if member['job'] == 'Director'), None)

            movie = Movie(
                id=str(item['id']),
                title=item['title'],
                genre=[GENRE_ID_TO_NAME.get(genre_id, "Unknown") for genre_id in item.get('genre_ids', [])],
                director=director['name'] if director else "Unknown",
                year=item['release_date'].split('-')[0] if item.get('release_date') else "Unknown",
                release_date=item.get('release_date', "N/A"),
                overview=item.get('overview', "No overview available."),
                img="https://image.tmdb.org/t/p/w500" + item['poster_path'] if item.get('poster_path') else ""
            )
            movies.append(movie)

        return {
            "page": data.get('page', 1),
            "total_results": data.get('total_results', 0),
            "total_pages": data.get('total_pages', 1),
            "results": movies
        }

@router.get("/{movie_id}", response_model=Movie)
async def get_movie(movie_id: int):

    async with httpx.AsyncClient() as client:

        get_movie_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}"
        movie_response = await client.get(get_movie_url)

        if movie_response.status_code != 200:
            raise HTTPException(status_code=movie_response.status_code, detail="Movie not found")

        movie_details = movie_response.json()
        # genre in details response is contained like this:
        # "genres": [
        # {
        #    "id": 18,
        #    "name": "Drama"
        # }
        # ],

        credits_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={TMDB_API_KEY}"
        credits_response = await client.get(credits_url)

        if credits_response.status_code != 200:
            raise HTTPException(status_code=credits_response.status_code, detail="Credits not found")

        credits_details = credits_response.json()

        #Get the director from the crew list
        director = next((member for member in credits_details['crew'] if member['job'] == 'Director'), None)

        movie = Movie(
            id=str(movie_details['id']),
            title=movie_details['title'],
            genre=[genre['name'] for genre in movie_details.get('genres', [])],
            director=director['name'] if director else "Unknown",
            year=movie_details['release_date'].split('-')[0] if movie_details.get('release_date') else "Unknown",
            release_date=movie_details.get('release_date', "N/A"),
            overview=movie_details.get('overview', "No overview available."),
            img = "https://image.tmdb.org/t/p/w500" + movie_details['poster_path'] if movie_details.get('poster_path') else ""
        )

        return movie

@router.get("/{movie_id}/streaming_links")
async def get_movie_streaming_links(movie_id: int):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/watch/providers?api_key={TMDB_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Movie not found")
        response.raise_for_status()
        #return response.json()

        #Need to return the results for US region if it exists
        data = response.json()
        us_providers = data.get('results', {}).get('US', {})

        #Now, format the response to have a full image link and also return a link to the provider
        formatted_providers = {}
        for category, providers in us_providers.items():
            if category == "link":
                formatted_providers["link"] = providers
            else:
                formatted_providers[category] = []
                for provider in providers:
                    provider_info = {
                        "provider_name": provider['provider_name'],
                        "logo": f"https://image.tmdb.org/t/p/w500{provider['logo_path']}" if provider.get('logo_path') else "",
                        "link": STREAMING_LINKS.get(provider['provider_name'], "")
                    }
                    formatted_providers[category].append(provider_info)

        return formatted_providers

@router.get("/{movie_id}/average_rating")
async def get_movie_average_rating(movie_id: int):
    avg_rating = get_avg_ratings_by_movie_id(movie_id)
    if avg_rating is None:
        return {"movie_id": movie_id, "average_rating": 0}
    return {"movie_id": movie_id, "average_rating": avg_rating}