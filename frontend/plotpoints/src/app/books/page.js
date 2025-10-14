"use client";

import { useState, useEffect} from "react";
import Image from "next/image";
import React from "react";

import Header from "../components/Header";
import GenreContainer from "../components/GenreContainer";
import Footer from "../components/Footer";

export default function Books() {

  const [romanceBooks, setRomanceBooks] = useState([]);
  const [crimeBooks, setCrimeBooks] = useState([]);
  const [fantasyBooks, setFantasyBooks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async (genre, setBooks) => {
      try {
        const res = await fetch(`/api/books/genre/${genre}`);
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAllBooks = async () => {
      await Promise.all([
        fetchBooks("romance", setRomanceBooks),
        fetchBooks("crime", setCrimeBooks),
        fetchBooks("fantasy", setFantasyBooks),
      ]);
      setIsLoading(false);
    };

    fetchAllBooks();
  }, []);

  return (
    <div>
      <Header />
      <main className="p-6">
      
        {/* Genre Containers */}
        
        <GenreContainer label="Romance Books">
                  {romanceBooks.map((book) => (
                    <Image
                      key={book.id}
                      src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"}
                      title={book.title}
                      alt={book.title}
                      className="cover"
                      onClick={() => window.location.href = `/books/review/${book.id}`}
                      style={{ cursor: 'pointer' }}
                      width={1000}
                      height={1500}
                    />
                  ))}
        </GenreContainer>

        <GenreContainer label="Crime Books">
                  {crimeBooks.map((book) => (
                    <Image
                      key={book.id}
                      src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"}
                      title={book.title}
                      alt={book.title}
                      className="cover"
                      onClick={() => window.location.href = `/books/review/${book.id}`}
                      style={{ cursor: 'pointer' }}
                      width={1000}
                      height={1500}
                    />
                  ))}
        </GenreContainer>

        <GenreContainer label="Fantasy Books">
                  {fantasyBooks.map((book) => (
                    <Image
                      key={book.id}
                      src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"}
                      title={book.title}
                      alt={book.title}
                      className="cover"
                      onClick={() => window.location.href = `/books/review/${book.id}`}
                      style={{ cursor: 'pointer' }}
                      width={1000}
                      height={1500}
                    />
                  ))}
        </GenreContainer>
      </main>
      <Footer />
    </div>
  );
}