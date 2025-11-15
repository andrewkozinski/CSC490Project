"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/CategoryCarousel";
import "../components/Homepage.css";

export default function Movies() {

  const [horrorMovies, setHorrorMovies] = useState([]);
  const [historyMovies, setHistoryMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  //Handles fetching movies from the backend
  useEffect(() => {
    // Fetch movies for each genre
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
    // Fetch movies for each genre
    fetchMovies("horror", setHorrorMovies);
    fetchMovies("history", setHistoryMovies);
    fetchMovies("comedy", setComedyMovies);
    fetchMovies("science fiction", setSciFiMovies);
    fetchUpcomingMovies();

    
  }, []);

  return (
    <div>
      <Header />
      <main className="p-10">

        {/* Takes the response out of the backend and uses the images from the response in the backend */}
        {/*
        Example of how responses look like right now and are stored in the state variables above:
        {
        page: 1,
        results: [Array of movies],  (each movie has an id, title, genre, img, overview, release_date, title, and year parameter)
        total_pages: 500,
        total_results: 10000
        }
        
        */}
        <Carousel label="Horror Movies">
          {horrorMovies.map((movie) => (
            <img 
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => window.location.href = `/movies/review/${movie.id}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>
        <Carousel label="Comedy Movies">
          {comedyMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => window.location.href = `/movies/review/${movie.id}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>
        <Carousel label="Science Fiction Movies">
          {sciFiMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => window.location.href = `/movies/review/${movie.id}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>
        <Carousel label="History Movies">
          {historyMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => window.location.href = `/movies/review/${movie.id}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>
      </main>
      <Footer />
    </div>
  );
}