"use client";

import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import GenreContainer from "../components/GenreContainer";

export default function TV() {

  const [kidsShows, setKidsShows] = useState([]);
  const [dramaShows, setDramaShows] = useState([]);
  const [comedyShows, setComedyShows] = useState([]);
  const [crimeShows, setCrimeShows] = useState([]);

  //Handles fetching tv shows from the backend
  useEffect(() => {
    // Fetch shows for each genre
    const fetchShows = async (genre, setShows) => {
      try {
        const res = await fetch(`/api/tv/genre/${genre}`);
        if (!res.ok) throw new Error("Failed to fetch TV shows");
        const data = await res.json();
        setShows(data.results || []);
        console.log("GENRE: " + genre);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch shows for each genre
    fetchShows("kids", setKidsShows);
    fetchShows("drama", setDramaShows);
    fetchShows("comedy", setComedyShows);
    fetchShows("crime", setCrimeShows);    
  }, []);

  return (
    <div>
      <Header />
      <main className="p-6">
        <GenreContainer label="Kids Shows">
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
        <GenreContainer label="Drama Shows">
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
        <GenreContainer label="Comedy Shows">
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
        <GenreContainer label="Horror Shows">
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