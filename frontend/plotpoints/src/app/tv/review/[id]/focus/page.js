"use client";

import { useState, useEffect } from "react";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "../../../../components/Header";
import Review from "../../../../components/Review";

function TvReviewPage({ params }) {
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
  }, [id]);

  if (!tvDetails) {
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
        <div className="flex w-1/3 flex-initial flex-col items-center mt-10">
          <img
            src={
              tvDetails && tvDetails.img
                ? tvDetails.img
                : "https://placehold.co/600x400?text=No+Image"
            }
            title={tvDetails ? tvDetails.title : "TV Show Poster"}
            alt={tvDetails ? tvDetails.title : "TV Show Poster"}
            className="w-65 h-96 rounded-xl outline-2 mb-5"
          />
          <div>
            {/*description box*/}
            <p className="text-lg">Description:</p>
            <div className="flex p-4 border-2 rounded-xl min-h-[25vh] max-h-fit grow my-2 flex-col">
              <p className="text-lg">Title:<br /></p>
              <p className="text-xl font-bold"> {tvDetails.title}</p>
              <p className="flex grow">
                {tvDetails && tvDetails.description
                  ? tvDetails.description
                  : "No description available."}
              </p>
              <div className="pt-5">
                {/* Formats arrays */}
                <p>
                  Created by:{" "}
                  {Array.isArray(tvDetails.created_by)
                    ? tvDetails.created_by.join(", ")
                    : tvDetails.created_by}
                </p>

                <p>Date Released: {tvDetails.release_date}</p>
                <p>Seasons: {tvDetails.seasons}</p>
                <p>Episodes: {tvDetails.episodes}</p>
                <p>Streaming Links:</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-10 m-5 ml-10 mt-10 w-full flex flex-col border border-gray-500 rounded-xl shadow-xl">
          <Review></Review>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TvReviewPage;
