"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";
import ReviewList from "../../../components/ReviewList";
import fetchReviews from "@/utils/fetchReviews";
import fetchAvgRating from "@/utils/fetchAvgRating";
import fetchStreamLinks from "@/utils/fetchStreamLinks";
import Link from "next/link";

function TvReviewPage({ params }) {
  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  console.log("TV Show ID from URL: " + id);

  //Tv Show Details State
  const [tvDetails, setTvDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  //Check if user already has made a review
  const [userReview, setUserReview] = useState(null);
  const { data: session } = useSession();

  //Stream links, if available
  const [streamLinks, setStreamLinks] = useState([]);

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
    fetchReviews("tvshow", id, setReviews);
    fetchAvgRating("tvshows", id, setAvgRating);
    fetchStreamLinks("tvshows", id, setStreamLinks);

  }, [id, session]);

  // Check if user has already reviewed this TV show
  useEffect(() => {
    if (session?.user?.id) {
      const userReview = reviews.find((review) => review.user_id === session.user.id);
      setUserReview(userReview);
    }
  }, [reviews, session]);

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
        <div className="flex w-1/3 flex-initial flex-col items-center mt-10 ml-5">
          <img
            src={
              tvDetails && tvDetails.img
                ? tvDetails.img
                : "https://placehold.co/600x400?text=No+Image"
            }
            title={tvDetails ? tvDetails.title : "TV Show Poster"}
            alt={tvDetails ? tvDetails.title : "TV Show Poster"}
            className="w-56 h-86 rounded-sm mb-5"
          />
          <div>
            {/*description box*/}
            {/* <p className="text-lg">Description:</p> */}
            <div className="flex p-4 border-1 rounded-sm min-h-[25vh] max-h-fit grow my-2 flex-col">
              {/* <p className="text-lg">Title:<br /></p> */}
              <p className="text-2xl font-bold inria-serif-bold"> {tvDetails.title}</p>
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
                {streamLinks.length > 0 && (
                  <div className="mt-2">
                    <p>Streaming Links:</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {streamLinks.map((provider, idx) => (
                        provider.link ? (
                          <Link
                            key={idx}
                            href={provider.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                          <img
                          src={provider.logo}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          className="w-12 h-12 rounded hover:scale-110 transition-transform"
                            />
                          </Link>
                        ) : (
                          <img
                            key={idx}
                            src={provider.logo}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="w-12 h-12 rounded opacity-50"
                          />
                        )
                      ))}
                    </div>
                  </div>
                )
                } 

              </div>
            </div>
          </div>
        </div>
        <div className="p-10 m-5 ml-10 mt-10 w-full flex flex-col border border-gray-500 rounded-sm shadow-xl">
          <Rating
            id={id}
            placeholder="Write a review!"
            media="tvshow"
            avgRating={avgRating}
            reviews={reviews}
          >
          </Rating>
          <div>
            <p>Reviews:</p>
            <ReviewList reviewData={reviews} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TvReviewPage;
