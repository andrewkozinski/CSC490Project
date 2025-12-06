"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/CategoryCarousel";
import "../components/Homepage.css";
import { getRecommendedBooks } from "@/lib/recommendations";
import SkeletonImage from "../components/SkeletonImage";

export default function Books() {

  const { data: session } = useSession();

  const [romanceBooks, setRomanceBooks] = useState([]);
  const [crimeBooks, setCrimeBooks] = useState([]);
  const [fantasyBooks, setFantasyBooks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [recommendedBooks, setRecommendedBooks] = useState([]);

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

  useEffect(() => {
    if (session?.user?.id) {
      getRecommendedBooks(session.user.id).then(setRecommendedBooks).catch(console.error);
    }
  }, [session?.user]);

  return (
    <div>
      <Header />
      <main className="p-10">

        {/* Genre Containers */}

        <Carousel label="Romance Books">
          {romanceBooks.map((book) => (
            <Image
              key={book.id}
              src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"}
              title={book.title}
              alt={book.title}
              className="image"
              onClick={() => window.location.href = `/books/review/${book.id}`}
              style={{ cursor: 'pointer' }}
              width={1000}
              height={1500}
            />
          ))}
        </Carousel>

        <Carousel label="Crime Books">
          {crimeBooks.map((book) => (
            <Image
              key={book.id}
              src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"}
              title={book.title}
              alt={book.title}
              className="image"
              onClick={() => window.location.href = `/books/review/${book.id}`}
              style={{ cursor: 'pointer' }}
              width={1000}
              height={1500}
            />
          ))}
        </Carousel>

        <Carousel label="Fantasy Books">
          {fantasyBooks.map((book) => (
            <Image
              key={book.id}
              src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"}
              title={book.title}
              alt={book.title}
              className="image"
              onClick={() => window.location.href = `/books/review/${book.id}`}
              style={{ cursor: 'pointer' }}
              width={1000}
              height={1500}
            />
          ))}
        </Carousel>


        {/* Check if user is logged in, if so show recommendations */}
        {session?.user && (
          <Carousel label="Recommended Books">
            {/* If 0 show skeleton cards */}
            {recommendedBooks.length === 0 ? (
              Array.from({ length: 20 }).map((_, index) => (
                <SkeletonImage key={index} useTennaImage={true} />
              ))
            ) : (
              recommendedBooks.map((book) => (
                <img
                  key={book.id}
                  src={book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"}
                  title={book.name}
                  className="image"
                  onClick={() => window.location.href = `/books/review/${book.id}`}
                  style={{ cursor: 'pointer' }}
                />
              ))
            )}
          </Carousel>
        )}

      </main>
      <Footer />
    </div>
  );
}