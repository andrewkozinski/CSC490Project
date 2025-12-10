"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/CategoryCarousel";
import "../components/Homepage.css";
import { getRecommendedMovies } from "@/lib/recommendations";
import { useSession } from "next-auth/react";
import SkeletonImage from "../components/SkeletonImage";
import { Skeleton } from "@mui/material";
// import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Movies() {
  
  const router = useRouter();

  const { data: session } = useSession();

  const [actionMovies, setActionMovies] = useState([]);
  const [adventureMovies, setAdventureMovies] = useState([]);
  const [animationMovie, setAnimationMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [crimeMovies, setCrimeMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [familyMovies, setFamilyMovies] = useState([]);
  const [fantasyMovies, setFantasyMovies] = useState([]);
  const [historyMovies, setHistoryMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [musicMovies, setMusicMovies] = useState([]);
  const [mysteryMovies, setMysteryMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [thrillerMovies, setThrillerMovies] = useState([]);
  
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

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
    fetchMovies("action", setActionMovies);
    fetchMovies("adventure", setAdventureMovies);
    fetchMovies("animation", setAnimationMovies);
    fetchMovies("comedy", setComedyMovies);
    fetchMovies("crime", setCrimeMovies);
    fetchMovies("drama", setDramaMovies);
    fetchMovies("family", setFamilyMovies);
    fetchMovies("fantasy", setFantasyMovies);
    fetchMovies("history", setHistoryMovies);
    fetchMovies("horror", setHorrorMovies);
    fetchMovies("music", setMusicMovies);
    fetchMovies("mystery", setMysteryMovies);
    fetchMovies("romance", setRomanceMovies);
    fetchMovies("science fiction", setSciFiMovies);
    fetchMovies("thriller", setThrillerMovies);

    fetchUpcomingMovies();
  }, []);

  // Fetch recommended movies based on user ID
  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      console.log("Fetching recommended movies for user:", session?.user?.id);
      if (session?.user?.id) {
        try {
          const data = await getRecommendedMovies(session.user.id);
          setRecommendedMovies(data || []);
          console.log("RECOMMENDED MOVIES:");
          console.log(data);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchRecommendedMovies();
  }, [session?.user]);

  return (
    <div>
      <Header />
      <main className="p-10">
        <h1 className="text-3xl inria-serif-bold text-center pb-2">Movies</h1>
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
        {/* Check if user is logged in, if so show recommendations */}
        {session?.user && (
          <Carousel label="Recommended">
            {/* If 0 show skeleton cards */}
            {recommendedMovies.length === 0 ? (
              Array.from({ length: 20 }).map((_, index) => (
                <SkeletonImage key={index} useTennaImage={true} />
              ))
            ) : (
              recommendedMovies.map((movie) => (
                <img
                  key={movie.id}
                  src={movie.img}
                  title={movie.title}
                  className="image"
                  onClick={() => router.push(`/movies/review/${movie.id}`)}
                  style={{ cursor: 'pointer' }}
                />
              ))
            )}
          </Carousel>
        )}
        
        <Carousel label="Upcoming">
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
        <Carousel label="Action">
          {actionMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {actionMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        {/* <Carousel label="Adventure">
          {adventureMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {adventureMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel> */}
        <Carousel label="Animated">
          {animationMovie.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {animationMovie.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Comedy">
          {comedyMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {comedyMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Crime">
          {crimeMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {crimeMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Drama">
          {dramaMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {dramaMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Family">
          {familyMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {familyMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Fantasy">
          {fantasyMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {fantasyMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        {/* <Carousel label="History">
          {historyMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {historyMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel> */}
        <Carousel label="Horror">
          {horrorMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {horrorMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Music">
          {musicMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {musicMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Mystery">
          {mysteryMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {mysteryMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Romance">
          {romanceMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {romanceMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        <Carousel label="Science Fiction">
          {sciFiMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {sciFiMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel>
        {/* <Carousel label="Thriller">
          {thrillerMovies.map((movie) => (
            <img
              key={movie.id}
              src={movie.img}
              title={movie.title}
              className="image"
              onClick={() => router.push(`/movies/review/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          {thrillerMovies.length === 0 && (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonImage key={index} useTennaImage={false} />
            ))
          )}
        </Carousel> */}
        
      </main>
      <Footer />
    </div>
  );
}