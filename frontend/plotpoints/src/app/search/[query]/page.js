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

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`/api/search/${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data.results || []);
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

            <Footer />
        </div>
    );
}