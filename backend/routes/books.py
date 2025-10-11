from fastapi import APIRouter, HTTPException
import httpx
from models.book import Book
from database.trending_books import get_top_books_reviewed
from database.ratings import get_avg_rating

router = APIRouter()

#Create image links for a book based on id
def build_cover_links(cover_id: int | None):
    placeholder = "https://placehold.co/100x150?text=No+Image"
    if cover_id:
        large = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
        thumbnail = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
    else:
        large = thumbnail = placeholder
    return {"large": large, "thumbnail": thumbnail}

@router.get("/search")
async def search_books(query: str, page: int = 1):
    url = f"https://openlibrary.org/search.json?q={query}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        print("HERE")

        books = []
        for doc in data.get("docs", []):
            cover_links = build_cover_links(doc.get("cover_i"))
            book = Book(
                id=doc.get("key", "").replace("/works/", ""),
                title=doc.get("title", "N/A"),
                description=doc.get("first_sentence", "N/A") if isinstance(doc.get("first_sentence"), str) else "N/A",
                authors=doc.get("author_name", ["N/A"]),
                date_published=str(doc.get("first_publish_year", "N/A")),
                categories=doc.get("subject", ["N/A"]),
                thumbnailUrl=cover_links["large"],
            )
            books.append(book)

        return {
            "page": page,
            "total_results": data.get("numFound", 0),
            "results": books,
        }


@router.get("/{book_id}")
async def get_book_details(book_id: str):
    url = f"https://openlibrary.org/works/{book_id}.json"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Book not found")
        response.raise_for_status()
        item = response.json()


        cover_links = build_cover_links(item.get("covers", [None])[0] if item.get("covers") else None)

        # Fetch author names
        authors = []
        if "authors" in item:
            for a in item["authors"]:
                author_key = a.get("author", {}).get("key")
                if author_key:
                    author_url = f"https://openlibrary.org{author_key}.json"
                    author_resp = await client.get(author_url)
                    if author_resp.status_code == 200:
                        author_data = author_resp.json()
                        authors.append(author_data.get("name", "N/A"))

        book = Book(
            id=book_id,
            title=item.get("title", "N/A"),
            description=item.get("description", {}).get("value") if isinstance(item.get("description"), dict) else item.get("description", "N/A"),
            authors=authors or ["N/A"],
            date_published=item.get("created", {}).get("value", "N/A"),
            categories=item.get("subjects", ["N/A"]),
            thumbnailUrl=cover_links["large"],
            #avgRating=get_avg_rating(book_id)
        )
        return book


@router.get("/search/genre/{category}")
async def get_books_by_genre(category: str, page: int = 1):
    url = f"https://openlibrary.org/subjects/{category.lower().replace(' ', '_')}.json?limit=10&offset={(page-1)*10}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Category not found")
        response.raise_for_status()
        data = response.json()

        books = []
        for work in data.get("works", []):
            cover_links = build_cover_links(work.get("cover_id"))
            book = Book(
                id=work.get("key", "").replace("/works/", ""),
                title=work.get("title", "N/A"),
                description=work.get("description", "N/A"),
                authors=[a.get("name", "N/A") for a in work.get("authors", [])],
                date_published=str(work.get("first_publish_year", "N/A")),
                categories=[category],
                thumbnailUrl=cover_links["thumbnail"],
            )
            books.append(book)

        return {
            "page": page,
            "total_results": len(data.get("works", [])),
            "results": books,
        }


@router.get("/search/genre/{category}/{title}")
async def get_books_by_genre_and_title(category: str, title: str, page: int = 1):
    url = f"https://openlibrary.org/search.json?subject={category}&title={title}&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        books = []
        for doc in data.get("docs", []):
            cover_links = build_cover_links(doc.get("cover_i"))
            book = Book(
                id=doc.get("key", "").replace("/works/", ""),
                title=doc.get("title", "N/A"),
                description=doc.get("first_sentence", "N/A") if isinstance(doc.get("first_sentence"), str) else "N/A",
                authors=doc.get("author_name", ["N/A"]),
                date_published=str(doc.get("first_publish_year", "N/A")),
                categories=doc.get("subject", ["N/A"]),
                thumbnailUrl=cover_links["large"],
            )
            books.append(book)

        return {
            "page": page,
            "total_results": data.get("numFound", 0),
            "results": books,
        }


@router.get("/search/trending")
async def get_trending_books():
    books = get_top_books_reviewed()
    response = []
    for book in books:
        book_details = await get_book_details(book_id=book['book_id'])
        response.append(book_details)
    return {"total_results": len(response), "results": response}

@router.get("/{book_id}/average_rating")
async def get_movie_average_rating(book_id: str):
    avg_rating = get_avg_rating(str(book_id))
    if avg_rating is None:
        return {"book_id": book_id, "average_rating": 0}
    return {"book_id": book_id, "average_rating": avg_rating}