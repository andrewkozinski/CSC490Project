"use client";

import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Carousel from "../components/CategoryCarousel";
import "../components/Homepage.css";

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
      <main className="p-10">

        {/* Genre Containers */}
        <Carousel label ="Drama Shows">
          {dramaShows.map((show) => (
            <img
              key={show.id}
              src={show.img}
              title={show.name}
              className="image"
              onClick={() => window.location.href = `/tv/review/${show.id}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>
        <Carousel label ="Comedy Shows">
          {comedyShows.map((show) => (
            <img
              key={show.id}
              src={show.img}
              title={show.name}
              className="image"
              onClick={() => window.location.href = `/tv/review/${show.id}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>
        <Carousel label ="Kids Shows">
          {kidsShows.map((show) => (
            <img
              key={show.id}
              src={show.img}
              title={show.name}
              className="image"
              onClick={() => window.location.href = `/tv/review/${show.id}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>
        <Carousel label ="Crime Shows">
          {crimeShows.map((show) => (
            <img
              key={show.id}
              src={show.img}
              title={show.name}
              className="image"
              onClick={() => window.location.href = `/tv/review/${show.id}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>
      </main>
      <Footer />
    </div>
  );
}