from fastapi import APIRouter, HTTPException
import httpx
from models.book import Book
from database.trending_books import get_top_books_reviewed

router = APIRouter()

#Helper function to get isbn out of the industry_identifiers in the google books api response
def get_isbn(industry_identifiers, type):
    for identifier in industry_identifiers:
        if identifier['type'] == type:
            return identifier.get("identifier")
    return 'N/A'

#Helper function to clean up image links in the google books api response
#If large image link is not available, use thumbnail link instead
#If neither are available, use placeholder image link with the text "No Image"
def clean_image_links(volume_info):
    placeholder = "https://placehold.co/100x100?text=No+Image"
    image_links = volume_info.get('imageLinks', {})
    large = image_links.get('large', image_links.get('thumbnail', placeholder))
    thumbnail = image_links.get('thumbnail', placeholder)
    volume_info['imageLinks'] = {'large': large, 'thumbnail': thumbnail}
    return volume_info['imageLinks']

@router.get("/search")
async def search_books(query: str, page: int = 1):
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&startIndex={(page-1)*10}&maxResults=10&"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        books = []
        for item in data.get('items', []):
            """
            book model
                id: str
                title: str
                description: str
                authors: List[str]
                date_published: str
                pageCount: int
                thumbnailUrl: str
                isbn_10: str
                isbn_13: str
            """

            #To get extra large thumbnail, we need to call into the same route as book details
            #As that thumbnail is not included in the search results
            detail_url = f"https://www.googleapis.com/books/v1/volumes/{item['id']}"
            detail_response = await client.get(detail_url)
            detail_response.raise_for_status()
            detail_item = detail_response.json()
            if 'imageLinks' in detail_item['volumeInfo']:
                item['volumeInfo']['imageLinks']['large'] = detail_item['volumeInfo']['imageLinks'].get('large', '')
            else:
                item['volumeInfo']['imageLinks'] = {'large': ''}

            #get categories out of details response because that's not in a search query directly
            item['volumeInfo']['categories'] = detail_item['volumeInfo'].get('categories', ['N/A'])

            book = Book(
                id=item['id'],
                title=item['volumeInfo'].get('title', 'N/A'),
                description=item['volumeInfo'].get('description', 'N/A'),
                authors=item['volumeInfo'].get('authors', ['N/A']),
                date_published=item['volumeInfo'].get('publishedDate', 'N/A'),
                categories=item['volumeInfo'].get('categories', ['N/A']),
                pageCount=item['volumeInfo'].get('pageCount', 0),
                thumbnailUrl=item['volumeInfo'].get('imageLinks', {}).get('thumbnail', ''),
                thumbnailExtraLargeUrl=item['volumeInfo'].get('imageLinks', {}).get('large', ''),
                isbn_10=get_isbn(item['volumeInfo'].get('industryIdentifiers'), 'ISBN_10'),
                isbn_13=get_isbn(item['volumeInfo'].get('industryIdentifiers'), 'ISBN_13'),
            )
            books.append(book)

        return {
            "page": page,
            "total_results": data.get('totalItems', 0),
            "results": books
        }


@router.get("/{book_id}")
async def get_book_details(book_id: str):
    url = f"https://www.googleapis.com/books/v1/volumes/{book_id}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Book not found")
        response.raise_for_status()
        item = response.json()

        #Need to call another route to get ISBN because for some reason
        #Google Books API doesn't include it in the direct book details response
        #But it does include it in the search response
        title = item['volumeInfo'].get('title', 'N/A')
        search_url = f"https://www.googleapis.com/books/v1/volumes?q=intitle:{title}&maxResults=1"
        search_response = await client.get(search_url)
        search_response.raise_for_status()
        search_data = search_response.json()
        industry_identifiers = search_data.get('items', [{}])[0].get('volumeInfo', {}).get('industryIdentifiers', [])
        isbn_10 = get_isbn(industry_identifiers, 'ISBN_10')
        isbn_13 = get_isbn(industry_identifiers, 'ISBN_13')

        #Also grab description because that's also not in the details response for some reason
        if 'description' not in item['volumeInfo']:
            item['volumeInfo']['description'] = search_data.get('items', [{}])[0].get('volumeInfo', {}).get('description', 'N/A')

        #If extra large thumbnail is not in the details response, set it to thumbnail url, if thumbnail url is empty as well, then set it to placeholder https://placehold.co/600x400?text=No+Image
        clean_image_links(volume_info=item['volumeInfo'])

        book = Book(
            id=item['id'],
            title=item['volumeInfo'].get('title', 'N/A'),
            description=item['volumeInfo'].get('description', 'N/A'),
            authors=item['volumeInfo'].get('authors', ['N/A']),
            date_published=item['volumeInfo'].get('publishedDate', 'N/A'),
            categories=item['volumeInfo'].get('categories', ['N/A']),
            pageCount=item['volumeInfo'].get('pageCount', 0),
            thumbnailUrl=item['volumeInfo'].get('imageLinks', {}).get('thumbnail', ''),
            thumbnailExtraLargeUrl=item['volumeInfo'].get('imageLinks', {}).get('large', ''),
            isbn_10=isbn_10,
            isbn_13=isbn_13,
        )
        return book

#Get by genre/category
@router.get("/search/genre/{category}")
async def get_books_by_genre(category: str, page: int = 1):
    url = f"https://www.googleapis.com/books/v1/volumes?q=subject:{category}&startIndex={(page-1)*10}&maxResults=10&"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        books = []
        for item in data.get('items', []):
            #To get extra large thumbnail, we need to call into the same route as book details
            #As that thumbnail is not included in the search results
            detail_url = f"https://www.googleapis.com/books/v1/volumes/{item['id']}"
            detail_response = await client.get(detail_url)
            detail_response.raise_for_status()
            detail_item = detail_response.json()
            if 'imageLinks' in detail_item['volumeInfo']:
                item['volumeInfo']['imageLinks']['large'] = detail_item['volumeInfo']['imageLinks'].get('large', '')
            else:
                item['volumeInfo']['imageLinks'] = {'large': ''}

            #get categories out of details response because that's not in a search query directly
            item['volumeInfo']['categories'] = detail_item['volumeInfo'].get('categories', ['N/A'])

            #Clean image links to ensure both large and thumbnail are present
            clean_image_links(volume_info=item['volumeInfo'])

            book = Book(
                id=item['id'],
                title=item['volumeInfo'].get('title', 'N/A'),
                description=item['volumeInfo'].get('description', 'N/A'),
                authors=item['volumeInfo'].get('authors', ['N/A']),
                date_published=item['volumeInfo'].get('publishedDate', 'N/A'),
                categories=item['volumeInfo'].get('categories', ['N/A']),
                pageCount=item['volumeInfo'].get('pageCount', 0),
                thumbnailUrl=item['volumeInfo'].get('imageLinks', {}).get('thumbnail', ''),
                thumbnailExtraLargeUrl=item['volumeInfo'].get('imageLinks', {}).get('large', ''),
                isbn_10=get_isbn(item['volumeInfo'].get('industryIdentifiers'), 'ISBN_10'),
                isbn_13=get_isbn(item['volumeInfo'].get('industryIdentifiers'), 'ISBN_13'),
            )
            books.append(book)

        return {
            "page": page,
            "total_results": data.get('totalItems', 0),
            "results": books
        }

#Get trending books - we define trending as the books with the most reviews in our database
@router.get("/search/trending")
async def get_trending_books():
    #Google Books API doesn't have a trending route
    #So we're instead returning the 15 books with the most reviews from the DB
    books = get_top_books_reviewed()
    response = []
    for book in books:
        #Only the id is returned, we need all the information so why not just call the details route we have set up in this file
        book_details = await get_book_details(book_id=book['book_id'])
        response.append(book_details)
    return {"total_results": len(response), "results": response}