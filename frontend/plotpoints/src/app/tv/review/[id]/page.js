"use client";

import { useState, useEffect, use } from "react";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";


function TvReviewPage({params}) {

  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  console.log("TV Show ID from URL: " + id);
  
  //Tv Show Details State
  const [tvDetails, setTvDetails] = useState(null);

  // Need to fetch data using this ID to get the details of the TV show
  useEffect(() => {
    const fetchTvDetails = async () => {
      try {
        const response = await fetch(`/api/tv/details/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch TV show details");
        }
        const data = await response.json();
        console.log("Fetched TV Show Details:", data);
        setTvDetails(data);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
      }
    };

    fetchTvDetails();
  }, []);

  if(!tvDetails) {
    return (
      <>
        <Header />
        <p>Loading TV Show Details...</p>
      </>

    );
  }

  return (
    <div>
      <Header />
      <div className="flex m-5">
        <div className="flex w-1/3 flex-initial flex-col items-center justify-center">
          <img
            src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg"
            title={tvDetails ? tvDetails.title : "TV Show Poster"}
            alt={tvDetails ? tvDetails.title : "TV Show Poster"}
            className="w-65 h-96 rounded-xl outline-2 mb-5"
          />
          <p>Your Rating</p>
          <Rating />
          <p>Viewer Rating</p>
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
            {tvDetails ? tvDetails.description : "No description available."}
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

export default TvReviewPage;
