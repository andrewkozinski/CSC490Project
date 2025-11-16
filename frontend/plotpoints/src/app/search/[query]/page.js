"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Filter from "@/app/components/Filter";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function Home() {

    //Get search query from URL
    const { query } = useParams();
    const decodedQuery = decodeURIComponent(query);
    console.log("Search query:", decodedQuery);

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const [movieResults, setMovieResults] = useState([]);
    const [tvResults, setTvResults] = useState([]);
    const [bookResults, setBookResults] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`/api/search/${encodeURIComponent(decodedQuery)}`);
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
                <p className="m-10 min-h-screen">Loading...</p>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            {/*For now, we're just displaying the results. Nothing fancy, search bar should be in here in future*/}
            {/*I am well aware this doesn't look good but it was more so just to get something displayed somewhere */}
            <div className="m-20">
                <h1 className="inria-serif-bold text-center text-3xl -mt-5">Search for: {decodedQuery}</h1>
                <Filter/>
                <div className="ml-13">
                <h1 className="font-bold text-2xl mt-20 mb-5">Movies</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem" }}>
                    {movieResults?.map(movie => (
                        !movie.img ? null : (
                            <div key={movie.id} style={{ width: 150, cursor: "pointer" }} onClick={() => window.location.href = `/movies/review/${movie.id}`}>
                                <Image src={movie.img} alt={movie.title} width={100} height={150} className="cover"/>
                                <div className="text-center mt-3">
                                    <div>{movie.title}</div>
                                    <div>{movie.year}</div>
                                </div>

                                
                            </div>
                        )
                    ))}
                </div>

                <h1 className="font-bold text-2xl mb-5 mt-20">TV Shows</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem" }}>
                    {tvResults?.map(show => (
                        !show.img ? null : (
                        <div key={show.id} style={{ width: 150, cursor: "pointer" }} onClick={() => window.location.href = `/tv/review/${show.id}`}>
                            <Image src={show.img ? show.img : null} alt={show.title} width={100} height={150} className="cover"/>
                            <div className="text-center mt-3">
                                <div>{show.title}</div>
                                <div>{show.release_date}</div>
                            </div>
                        </div>
                        )
                    ))}
                </div>

                <h1 className="font-bold text-2xl mb-5 mt-20">Books</h1> 
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem" }}>
                    {bookResults?.map(book => (
                        <div key={book.id} style={{ width: 150, cursor: "pointer" }} onClick={() => window.location.href = `/books/review/${book.id}`}>
                            <Image src={book.thumbnailUrl ? book.thumbnailUrl : null} alt={book.title} width={100} height={150} className="cover"/>
                            <div className="text-center mt-3">
                                <div>{book.title}</div>
                                <div>{book.authors?.join(", ")}</div>
                                <div>{book.date_published}</div>
                            </div>    
                        </div>
                    ))}
                </div>
                </div>
                
            </div>


            <Footer />
        </div>
    );
}