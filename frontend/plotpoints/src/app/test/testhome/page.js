"use client";

import { useState, useEffect } from "react";
//import "@/app/Homepage.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import GenreContainer from "@/app/components/GenreContainer";
import Image from "next/image";


export default function Test2() {

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const moviesResponse = await fetch('/api/movies/trending');
        const showsResponse = await fetch('/api/tv/trending');
        const booksResponse = await fetch('/api/books/trending');
        const moviesData = await moviesResponse.json();
        const showsData = await showsResponse.json();
        const booksData = await booksResponse.json();
        console.log(moviesData);
        console.log(showsData);
        setTrendingMovies(moviesData);
        setTrendingShows(showsData);
        console.log(booksData);
        setTrendingBooks(booksData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending data:", error);
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);*/

  if (loading) {
    return(
      <div>
      <Header/>
      <div className="flex grid-cols-2 items-center p-15">
        <div className="items-top float:right place-items-top -mt-140">
          <h1 className="text-4xl inria-serif-regular whitespace-nowrap">Welcome to Tenna Points!</h1>
          <p className="flex whitespace-nowrap">A unified review site for tv shows, tv shows and tv shows</p>
        </div>
        <div className="wrapper ml-20">
          <GenreContainer label="Loading...">
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
          </GenreContainer>
          <GenreContainer label="Loading...">
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
          </GenreContainer>
          <GenreContainer label="Loading...">
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
          </GenreContainer>
        </div>
      </div>
      <Footer/>
      
    </div>
    );
  }

  return (
    <div>
      <Header/>
      <div className="flex grid-cols-2 items-center p-15">
        <div className="items-top float:right place-items-top -mt-140">
          <h1 className="text-4xl inria-serif-regular whitespace-nowrap">Welcome to Plot Points!</h1>
          <p className="flex whitespace-nowrap">A unified review site for movies, tv shows and books</p>
        </div>
        <div className="wrapper ml-20">
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
      </div>
      <Footer/>
    </div>
  );
}