"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GenreContainer from "./components/GenreContainer";
import Image from "next/image";
import Review from "./components/HomepageReview";
import './components/Homepage.css';


export default function Home() {

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const moviesResponse = await fetch('/api/movies/trending');
        const showsResponse = await fetch('/api/tv/trending');
        const booksResponse = await fetch('/api/books/trending');
        const reviewsResponse = await fetch('/api/reviews/get/recent_reviews');
        const moviesData = await moviesResponse.json();
        const showsData = await showsResponse.json();
        const booksData = await booksResponse.json();
        const reviewsData = await reviewsResponse.json();
        console.log(moviesData);
        console.log(showsData);
        setTrendingMovies(moviesData);
        setTrendingShows(showsData);
        console.log(booksData);
        setTrendingBooks(booksData);
        setRecentReviews(reviewsData.reviews);
        console.log(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending data:", error);
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <div>
      <Header/>
      <div className="items-center mt-10">
          <h1 className="text-4xl text-center inria-serif-regular whitespace-nowrap">Welcome to Plot Points!</h1>
          <p className="text-center whitespace-nowrap">A unified review site for movies, tv shows and books</p>
      </div>
      <div className="flex grid-cols-2 items-center p-15">
        {/* <div className="items-top float:right place-items-top -mt-140">
          <h1 className="text-4xl inria-serif-regular whitespace-nowrap">Welcome to Plot Points!</h1>
          <p className="flex whitespace-nowrap">A unified review site for movies, tv shows and books</p>

        </div> */}
        <div className="wrapper ml-10">
          <GenreContainer label="Trending Movies">
            {trendingMovies?.results?.map((movie) => (
              <img key={movie.id} className="image" src={movie.img} alt={movie.title} onClick={() => window.location.href = `/movies/review/${movie.id}`} style={{ cursor: 'pointer' }}/>
            ))}
          </GenreContainer>
          <GenreContainer label="Trending Shows">
            {trendingShows?.results?.map((show) => (
              <img key={show.id} className="image" src={show.img} alt={show.title} onClick={() => window.location.href = `/tv/review/${show.id}`} style={{ cursor: 'pointer' }}/>
            ))}
          </GenreContainer>
          <GenreContainer label="Trending Books">
            {trendingBooks?.results?.map((book) => (
              <Image key={book.id} className="image" src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"} onClick={() => window.location.href = `/books/review/${book.id}`} style={{ cursor: 'pointer' }} alt={book.title} width={1000} height={1500}/>
            ))}
          </GenreContainer>
         
    
        </div>
        <div className="ml-40 -mt-110">
          <h2 className="text-2xl font-bold pl-10">Recent Reviews</h2>
          <div className="flex flex-col gap-5 pt-9 ml-10">
            {recentReviews?.map((review, idx) => (
              <Review 
                key={review?.id ?? idx}
                reviewData={review}
              />
            ))}
          </div>
      </div>
      
      </div>
      <Footer/>
    </div>
  );
}