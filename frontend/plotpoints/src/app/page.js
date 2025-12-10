"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Image from "next/image";
import Review from "./components/HomepageReview";
import './components/Homepage.css';
import Carousel from "./components/Carousel";
import SkeletonImage from "./components/SkeletonImage";
import HomepageReviewSkeleton from "./components/HomepageReviewSkeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [airingTodayShows, setAiringTodayShows] = useState([]);

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

        const fetchMovies = async (genre, setMovies) => {
      try {
        const res = await fetch(`/api/movies/genre/${genre}`);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data.results || []);
        console.log("GENRE: " + genre);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUpcomingMovies = async () => {
      try {
        const res = await fetch(`/api/movies/upcoming`);
        if (!res.ok) throw new Error("Failed to fetch upcoming movies");
        const data = await res.json();
        setUpcomingMovies(data.results || []);
        console.log("UPCOMING MOVIES:");
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAiringTodayShows = async () => {
      try {
        const res = await fetch(`/api/tv/airing_today`);
        if (!res.ok) throw new Error("Failed to fetch airing today TV shows");
        const data = await res.json();
        setAiringTodayShows(data.results || []);
        console.log("AIRING TODAY SHOWS:");
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
        console.log(moviesData);
        console.log(showsData);
        console.log(booksData);
        console.log(reviewsData);

        setTrendingMovies(moviesData);
        setTrendingShows(showsData);
        setTrendingBooks(booksData);
        setRecentReviews(reviewsData.reviews);
        fetchUpcomingMovies();
        fetchAiringTodayShows();

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
              <img key={movie.id} className="image" src={movie.img} alt={movie.title} onClick={() => router.push(`/movies/review/${movie.id}`)} style={{ cursor: 'pointer' }}/>
            ))}
            {loading && (
              Array.from({ length: 20 }).map((_, index) => (
                <SkeletonImage key={index} useTennaImage={false} />
              ))
            )}
          </Carousel>
          <Carousel label="Trending Shows">
            {trendingShows?.results?.map((show) => (
              <img key={show.id} className="image" src={show.img} alt={show.title} onClick={() => router.push(`/tv/review/${show.id}`)} style={{ cursor: 'pointer' }}/>
            ))}
            {loading && (
              Array.from({ length: 20 }).map((_, index) => (
                <SkeletonImage key={index} useTennaImage={false} />
              ))
            )}

          </Carousel>
          <Carousel label="Trending Books">
            {trendingBooks?.results?.map((book) => (
              <Image key={book.id} className="image" src={book.thumbnailExtraLargeUrl || book.thumbnailUrl || "https://placehold.co/100x100?text=No+Image"} onClick={() => router.push(`/books/review/${book.id}`)} style={{ cursor: 'pointer' }} alt={book.title} width={1000} height={1500}/>
            ))}
            {loading && (
              Array.from({ length: 20 }).map((_, index) => (
                <SkeletonImage key={index} useTennaImage={false} />
              ))
            )}
          </Carousel>
          <Carousel label="Upcoming Movies">
          {upcomingMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {upcomingMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Airing TV Shows">
          {airingTodayShows.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {airingTodayShows.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
    
        </div>
        <div className="w-1/3 pb-5 -ml-5">
          <h2 className="text-2xl font-bold pl-10 whitespace-nowrap">Recent Reviews</h2>
          <div className="flex flex-col items-start gap-8 pt-8 ml-10 max-w-full">
            {recentReviews?.map((review, idx) => (
              <Review 
                key={review?.id ?? idx}
                reviewData={review}
              />
            ))}
            {loading && (
              Array.from({ length: 6 }).map((_, index) => (
                <HomepageReviewSkeleton key={index} useTennaImage={false} />
              ))
            )}
          </div>
        </div>
      
      </div>
      
      
      <Footer/>
    </div>
  );
}