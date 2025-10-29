"use client";

import { useState, useEffect } from "react";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "../../../../components/Header";
import Review from "../../../../components/Review";

function IndividualMovieReviewPage({ params }) {
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
      <div className="flex m-5">
        <div className="flex w-1/3 flex-initial flex-col items-center mt-10 ml-5">
          <img
            src={
              movieDetails && movieDetails.img
                ? movieDetails.img
                : "https://placehold.co/600x400?text=No+Image"
            }
            title={movieDetails ? movieDetails.title : "Movie Poster"}
            alt={movieDetails ? movieDetails.title : "Movie Poster"}
            className="w-56 h-86 rounded-sm mb-5"
          />
          <div>
            {/*description box*/}
            {/* <p className="text-lg">Description:</p> */}
            <div className="flex p-4 border-1 rounded-sm min-h-[25vh] max-h-fit grow my-2 flex-col">
              {/* <p className="text-lg">Title:</p> */}
              <p className="text-2xl font-bold inria-serif-bold"> {movieDetails.title}</p>
              <p className="flex grow">
                {movieDetails && movieDetails.overview
                  ? movieDetails.overview
                  : "No description available."}
              </p>
              <div className="pt-5">
                <p>Director: {movieDetails.director}</p>
                <p>Date Released: {movieDetails.release_date}</p>
                <p>Streaming Links:</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-10 m-5 ml-10 mt-10 w-full flex flex-col border border-black rounded-sm shadow-xl">
          <Review></Review>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default IndividualMovieReviewPage;
