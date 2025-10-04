"use client";

import { useState, useEffect} from "react";
import React from "react";

import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";

function MovieReviewPage({params}) {

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
      }
      catch (error) {
        console.error("Error fetching movie details:", error);
        setMovieDetails(null);
      }
    };

    fetchMovieDetails();
  }, []);
  
  if(!movieDetails) {
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
      <div className="flex m-5">
        <div className="flex w-1/3 flex-initial flex-col items-center justify-center">
          <img
            src={movieDetails && movieDetails.img ? movieDetails.img : "https://placehold.co/600x400?text=No+Image"}
            title={movieDetails ? movieDetails.title : "Movie Poster"}
            alt={movieDetails ? movieDetails.title : "Movie Poster"}
            className="w-65 h-96 rounded-xl outline-2 mb-5"
          />
          <p>Your Rating</p>
          <Rating />
          <p>Audience Rating</p>
          <Rating />
          <textarea
            type="text"
            className="w-3/4 my-5 py-2 px-2 h-25 flex-initial border border-gray-400 rounded-md align-top resize-none"
            placeholder="Enter your text here"
          />
          <button className="brown text-black shadow m-4 py-2 px-6 rounded-lg justify center hover:cursor-pointer">
            Post!
          </button>
        </div>
        <div className="flex flex-col justify-end w-2/3 h-1/2 flex-initial">
          <p>Description:</p>
          <p className="p-4 border-2 h-1/2 rounded-xl w-auto my-2">
            {movieDetails && movieDetails.overview ? movieDetails.overview : "No description available."}
          </p>
          <div>
            <p>Comments:</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MovieReviewPage;