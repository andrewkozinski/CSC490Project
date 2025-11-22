"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Carousel from "../components/CategoryCarousel";
import "../components/Homepage.css";
import SkeletonImage from "../components/SkeletonImage";

export default function TV() {

  const { data: session } = useSession();

  const [kidsShows, setKidsShows] = useState([]);
  const [dramaShows, setDramaShows] = useState([]);
  const [comedyShows, setComedyShows] = useState([]);
  const [crimeShows, setCrimeShows] = useState([]);
  const [airingTodayShows, setAiringTodayShows] = useState([]);
  const [recommendedShows, setRecommendedShows] = useState([]);

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

    // Fetch shows for each genre
    fetchShows("kids", setKidsShows);
    fetchShows("drama", setDramaShows);
    fetchShows("comedy", setComedyShows);
    fetchShows("crime", setCrimeShows);    
    fetchAiringTodayShows();
  }, []);

  // Fetch recommended TV shows based on user ID
  useEffect(() => {
    const fetchRecommendedShows = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/recommendations/tvshows?userId=${encodeURIComponent(session.user.id)}`);
          if (!res.ok) throw new Error("Failed to fetch recommended TV shows");
          const data = await res.json();
          setRecommendedShows(data || []);
          console.log("RECOMMENDED TV SHOWS:");
          console.log(data);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchRecommendedShows();
  }, [session?.user]);

  return (
    <div>
      <Header />
      <main className="p-10">

        <Carousel label ="Airing Today">
          {airingTodayShows.map((show) => (
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

        {/* Check if user is logged in, if so show recommendations */}
        {session?.user && (
          <Carousel label="Recommended Shows">
          {/* If 0 show skeleton cards */}
          {recommendedShows.length === 0 ? (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} />
            ))
          ) : (
            recommendedShows.map((show) => (  
              <img
                key={show.id}
                src={show.img}
                title={show.name}
                className="image"
                onClick={() => window.location.href = `/tv/review/${show.id}`}
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