"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import GenreContainer from "../components/GenreContainer";
import Footer from "../components/Footer";

export default function Movies() {

  const [horrorMovies, setHorrorMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);

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
    
    // Fetch movies for each genre
    fetchMovies("horror", setHorrorMovies);
    fetchMovies("drama", setDramaMovies);
    fetchMovies("comedy", setComedyMovies);
    fetchMovies("science fiction", setSciFiMovies);

    
  }, []);

  return (
    <div>
      <Header />
      <main className="p-6">
        <GenreContainer label="Horror Movies">
          <img
            src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg"
            title="Kpop Demon Hunters"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg"
            title="Superman 2025"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg"
            title="Weapons"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg"
            title="The Long Walk"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg"
            title="One Battle After Another"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/sUsVimPdA1l162FvdBIlmKBlWHx.jpg"
            title="Demon Slayer"
            className="cover"
          />
        </GenreContainer>
        <GenreContainer label="Drama Movies">
          <img
            src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg"
            title="Kpop Demon Hunters"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg"
            title="Superman 2025"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg"
            title="Weapons"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg"
            title="The Long Walk"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg"
            title="One Battle After Another"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/sUsVimPdA1l162FvdBIlmKBlWHx.jpg"
            title="Demon Slayer"
            className="cover"
          />
        </GenreContainer>
        <GenreContainer label="Comedy Movies">
          <img
            src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg"
            title="Kpop Demon Hunters"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg"
            title="Superman 2025"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg"
            title="Weapons"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg"
            title="The Long Walk"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg"
            title="One Battle After Another"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/sUsVimPdA1l162FvdBIlmKBlWHx.jpg"
            title="Demon Slayer"
            className="cover"
          />
        </GenreContainer>
        <GenreContainer label="Science Fiction Movies">
          <img
            src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg"
            title="Kpop Demon Hunters"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg"
            title="Superman 2025"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg"
            title="Weapons"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg"
            title="The Long Walk"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg"
            title="One Battle After Another"
            className="cover"
          />
          <img
            src="https://image.tmdb.org/t/p/w500/sUsVimPdA1l162FvdBIlmKBlWHx.jpg"
            title="Demon Slayer"
            className="cover"
          />
        </GenreContainer>
      </main>
      <Footer />
    </div>
  );
}