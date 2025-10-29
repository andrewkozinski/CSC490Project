"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Image from "next/image";
import Review from "./components/HomepageReview";
import './components/Homepage.css';
import Carousel from "./components/Carousel";


export default function Home() {

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const[movieRes, showRes, bookRes, reviewRes] = await Promise.all([
          fetch('/api/movies/trending'),
          fetch('/api/tv/trending'),
          fetch('/api/books/trending'),
          fetch('/api/reviews/get/recent_reviews?limit=6')
        ]);

        const [moviesData, showsData, booksData, reviewsData] = await Promise.all([
          movieRes.json(),
          showRes.json(),
          bookRes.json(),
          reviewRes.json()
        ]);

        console.log(moviesData);
        console.log(showsData);
        console.log(booksData);
        console.log(reviewsData);

        setTrendingMovies(moviesData);
        setTrendingShows(showsData);
        setTrendingBooks(booksData);
        setRecentReviews(reviewsData.reviews);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <div>
      <Header/>
      <div className="flex-row mt-10">
          <h1 className="text-4xl text-center inria-serif-regular whitespace-nowrap">Welcome to Plot Points!</h1>
          <p className="text-center whitespace-nowrap">A unified review site for movies, tv shows, and books</p>
      </div>    
      
      <div className="flex pl-10 pt-15">
        <div className="w-2/3">
          <Carousel label="Trending Movies">
            {trendingMovies?.results?.map((movie) => (
              <img key={movie.id} className="image" src={movie.img} alt={movie.title} onClick={() => window.location.href = `/movies/review/${movie.id}`} style={{ cursor: 'pointer' }}/>
            ))}
          </Carousel>
          <Carousel label="Trending Shows">
            {trendingShows?.results?.map((show) => (
              <img key={show.id} className="image" src={show.img} alt={show.title} onClick={() => window.location.href = `/tv/review/${show.id}`} style={{ cursor: 'pointer' }}/>
            ))}
          </Carousel>
          <Carousel label="Trending Books">
            {trendingBooks?.results?.map((book) => (
              <Image key={book.id} className="image" src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"} onClick={() => window.location.href = `/books/review/${book.id}`} style={{ cursor: 'pointer' }} alt={book.title} width={1000} height={1500}/>
            ))}
          </Carousel>
         
    
        </div>
        <div className="w-1/3 pb-10 -ml-5">
          <h2 className="text-2xl font-bold pl-10 whitespace-nowrap">Recent Reviews</h2>
          <div className="flex flex-col items-start gap-8 pt-9 ml-10">
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