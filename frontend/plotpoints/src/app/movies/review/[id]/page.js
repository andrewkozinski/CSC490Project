"use client";

import { useState, useEffect } from "react";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";
import ReviewList from "../../../components/ReviewList";
import fetchReviews from "@/utils/fetchReviews";
import fetchAvgRating from "@/utils/fetchAvgRating";
import fetchStreamLinks from "@/utils/fetchStreamLinks";
import Link from "next/link";
import { randomTennaLoading } from "@/lib/random_tenna_loading";
import Image from "next/image";
import Bookmark from "@/app/components/Bookmark";
import { useSession } from "next-auth/react";
import Favorite from "@/app/components/Favorite";


function MovieReviewPage({ params }) {
  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  console.log("Movie ID from URL: " + id);
  //Movie Details State
  const [movieDetails, setMovieDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  //Stream links, if available
  const [streamLinks, setStreamLinks] = useState([]);

  //Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState("/images/spr_tenna_t_pose_big.gif");

  //User session
  const { data: session } = useSession();

  // Need to fetch data using this ID to get the details of the movie
  useEffect(() => {

    setLoadingImage(randomTennaLoading());

    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/movies/details/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }
        const data = await response.json();
        console.log("Fetched Movie Details:", data);
        setMovieDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setMovieDetails(null);
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
    fetchReviews("movie", id, setReviews);
    fetchAvgRating("movies", id, setAvgRating);
    fetchStreamLinks("movies", id, setStreamLinks);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center h-4/5 mt-7 mb-7">
          <h1 className="text-2xl mb-4">Loading...</h1>
          <Image src={loadingImage} alt="Loading" width={500} height={300} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isLoading && !movieDetails) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl mb-4">Error: Failed to load Movie details.</h1>
          <Image src="/images/spr_tenna_grasp_anim_big.gif" alt="Error" width={500} height={300} />
        </div>
        <Footer />
      </div>
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
          
          {/*Only show bookmarking if user is logged in */}
          {session && session.user && (
            <Bookmark mediaType="movie" mediaId={id} />
          )}

          {/*Only show favoriting if user is logged in */}
          {session && session.user && (
            <Favorite mediaType="movie" mediaId={id} />
          )}

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
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-10 m-5 ml-10 mt-10 w-full flex flex-col border border-black-100 rounded-sm  shadow-xl">
          <Rating
            id={id}
            placeholder="Write a review!"
            media="movie"
            avgRating={avgRating}
            reviews={reviews}
          />
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

export default MovieReviewPage;
