"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function Home() {

    //Get search query from URL
    const { query } = useParams();
    console.log("Search query:", query);

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const [movieResults, setMovieResults] = useState([]);
    const [tvResults, setTvResults] = useState([]);
    const [bookResults, setBookResults] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`/api/search/${encodeURIComponent(query)}`);
                const data = await response.json();
                console.log("Search results data:", data);
                setResults(data.results || []);//full results
                
                setMovieResults(data.movies.results || []);
                setTvResults(data.tv_shows.results || []);
                setBookResults(data.books.results || []);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);

    if (loading) {
        return (
            <div>
                <Header />
                <p>Loading...</p>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            {/*For now, we're just displaying the results. Nothing fancy, search bar should be in here in future*/}
            {/*I am well aware this doesn't look good but it was more so just to get something displayed somewhere */}
            <>
                <h1 className="font-bold text-2xl">Movies</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    {movieResults?.map(movie => (
                        <div key={movie.id} style={{ width: 150, cursor: "pointer" }} onClick={() => window.location.href = `/movies/review/${movie.id}`}>
                            <Image src={movie.img ? movie.img : null} alt={movie.title} width={100} height={150} />
                            <div>{movie.title}</div>
                            <div>{movie.year}</div>
                        </div>
                    ))}
                </div>

                <h1 className="font-bold text-2xl">TV Shows</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    {tvResults?.map(show => (
                        <div key={show.id} style={{ width: 150, cursor: "pointer" }} onClick={() => window.location.href = `/tv/review/${show.id}`}>
                            <Image src={show.img ? show.img : null} alt={show.title} width={100} height={150} />
                            <div>{show.title}</div>
                            <div>{show.release_date}</div>
                        </div>
                    ))}
                </div>

                <h1 className="font-bold text-2xl">Books</h1> 
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    {bookResults?.map(book => (
                        <div key={book.id} style={{ width: 150, cursor: "pointer" }} onClick={() => window.location.href = `/books/review/${book.id}`}>
                            <Image src={book.thumbnailUrl ? book.thumbnailUrl : null} alt={book.title} width={100} height={150} />
                            <div>{book.title}</div>
                            <div>{book.authors?.join(", ")}</div>
                            <div>{book.date_published}</div>
                        </div>
                    ))}
                </div>
                
                
            </>


            <Footer />
        </div>
    );
}