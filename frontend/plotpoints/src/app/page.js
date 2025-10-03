"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './Homepage.css';
import GenreContainer from "./components/GenreContainer";


export default function Home() {

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const moviesResponse = await fetch('/api/movies/trending');
        const showsResponse = await fetch('/api/tv/trending');
        //const booksResponse = await fetch('/api/books/trending'); DOES NOT EXIST YET!!! 
        const moviesData = await moviesResponse.json();
        const showsData = await showsResponse.json();
        //const booksData = await booksResponse.json();
        console.log(moviesData);
        console.log(showsData);
        setTrendingMovies(moviesData);
        setTrendingShows(showsData);
        //setTrendingBooks(booksData);
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
      <div className="flex grid-cols-2 items-center p-15">
        <div className="items-top float:right place-items-top -mt-140">
          <h1 className="text-4xl inria-serif-regular whitespace-nowrap">Welcome to Plot Points!</h1>
          <p className="flex whitespace-nowrap">A unified review site for movies, tv shows and books</p>
        </div>
        <div className="wrapper ml-20">
          <GenreContainer label="Trending Movies">
            <img className="image" src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg" alt="Kpop Demon Hunters"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg" alt="Superman 2025"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg" alt="Weapons"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg" alt="The Long Walk"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg" alt="One Battle After Another"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/sUsVimPdA1l162FvdBIlmKBlWHx.jpg" alt="Demon Slayer"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg" alt="Kpop Demon Hunters"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg" alt="Superman 2025"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg" alt="Kpop Demon Hunters"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg" alt="Superman 2025"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg" alt="Kpop Demon Hunters"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg" alt="Superman 2025"/>
          </GenreContainer>
          <GenreContainer label="Trending Shows">
            <img className="image" src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg" alt="Kpop Demon Hunters"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg" alt="Superman 2025"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg" alt="Weapons"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg" alt="The Long Walk"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg" alt="One Battle After Another"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/sUsVimPdA1l162FvdBIlmKBlWHx.jpg" alt="Demon Slayer"/>
          </GenreContainer>
          <GenreContainer label="Trending Books">
            <img className="image" src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg" alt="Kpop Demon Hunters"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg" alt="Superman 2025"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg" alt="Weapons"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg" alt="The Long Walk"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg" alt="One Battle After Another"/>
            <img className="image" src="https://image.tmdb.org/t/p/w500/sUsVimPdA1l162FvdBIlmKBlWHx.jpg" alt="Demon Slayer"/>
          </GenreContainer>
          <h1 className="font-bold pb-5">Trending Movies (backend data)</h1>
          <div className="flex grid grid-cols-6 gap-2 pb-10 max-w-800">
            {trendingMovies?.results?.map((movie) => (
              <img key={movie.id} className="image" src={movie.img} alt={movie.title} />
            ))}
          </div>
          <h1 className="font-bold pb-5">Trending Shows (backend data)</h1>
          <div className="flex grid grid-cols-6 gap-2 pb-10 max-w-800">
            {trendingShows?.results?.map((show) => (
              <img key={show.id} className="image" src={show.img} alt={show.title} />
            ))}
          </div> 

    
        </div>
      </div>
      <Footer/>
    </div>
  );
}