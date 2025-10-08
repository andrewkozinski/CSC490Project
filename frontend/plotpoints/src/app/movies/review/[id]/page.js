"use client";

import { useState, useEffect } from "react";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";

function MovieReviewPage({ params }) {
  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  console.log("Movie ID from URL: " + id);
  //Movie Details State
  const [movieDetails, setMovieDetails] = useState(null);
  // Need to fetch data using this ID to get the details of the movie
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/movies/details/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }
        const data = await response.json();
        console.log("Fetched Movie Details:", data);
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setMovieDetails(null);
      }
    };

    fetchMovieDetails();
  }, []);

  if (!movieDetails) {
    return (
      <>
        <Header />
        <p>Loading Movie Details...</p>
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="flex m-5 h-screen">
        <div className="flex w-1/3 flex-initial flex-col items-center">
          <img
            src={
              movieDetails && movieDetails.img
                ? movieDetails.img
                : "https://placehold.co/600x400?text=No+Image"
            }
            title={movieDetails ? movieDetails.title : "Movie Poster"}
            alt={movieDetails ? movieDetails.title : "Movie Poster"}
            className="w-65 h-96 rounded-xl outline-2 mb-5"
          />
          <Rating
            id={id}
            placeholder="Write a review!"
            media="movie"
            avgRating="4"
          >
            {" "}
            {/* need to change later*/}
          </Rating>
        </div>
        <div className="m-5 mt-10 flex flex-col">
          {/*description box*/}
          <div className="flex flex-col h-full flex-initial">
            <p className="text-lg">Description:</p>
            <div className="flex p-4 border-2 rounded-xl h-[25vh] w-auto my-2 flex-initial flex-col">
              <p className="flex flex-grow">
                {movieDetails && movieDetails.overview
                  ? movieDetails.overview
                  : "No description available."}
              </p>
              <div>
                <p>Director:</p>
                <p>Date Released:</p>
                <p>Streaming Links:</p>
              </div>
            </div>
            <div>
              <p>Comments:</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MovieReviewPage;
