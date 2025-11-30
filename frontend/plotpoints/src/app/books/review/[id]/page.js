"use client";

import { useState, useEffect } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";

import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";
import ReviewList from "../../../components/ReviewList";
import Bookmark from "@/app/components/Bookmark";
import Image from "next/image";
import Favorite from "@/app/components/Favorite";

import fetchReviews from "@/utils/fetchReviews";
import fetchAvgRating from "@/utils/fetchAvgRating";

import { useSession } from "next-auth/react";

import { randomTennaLoading } from "@/lib/random_tenna_loading";

function BookReviewPage({ params }) {

  function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  console.log("Book ID from URL: " + id);
  //Book Details State
  const [bookDetails, setBookDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  //Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState("/images/spr_tenna_t_pose_big.gif");

  //User session
  const { data: session } = useSession();

  // Need to fetch data using this ID to get the details of the book
  useEffect(() => {

    setLoadingImage(randomTennaLoading());

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/books/details/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        console.log("Fetched Book Details:", data);
        setBookDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setIsLoading(false);
      }
    };

    fetchBookDetails();
    fetchReviews("book", id, setReviews);
    fetchAvgRating("books", id, setAvgRating);
  }, [id]);

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

  if(!isLoading && !bookDetails) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl mb-4">Error: Failed to load Book details.</h1>
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
          <Image
            src={bookDetails.thumbnailUrl || ""}
            title={bookDetails.title || ""}
            alt={bookDetails.title || ""}
            className="w-56 h-86 rounded-sm mb-5"
            width={1000}
            height={1000}
          />
          {/*Only show bookmarking if user is logged in */}
          {session && session.user && (
            <Bookmark mediaType="book" mediaId={id} />
          )}
          {/*Only show favoriting if user is logged in */}
          {session && session.user && (
            <Favorite mediaType="book" mediaId={id} />
          )}
            {/* <p className="justify-start">Description:</p> */}
            <div className="p-4 border-1 rounded-sm w-auto my-2 min-h-fit">
              {/* <p className="text-lg">Title:</p> */}
              <p className="text-2xl font-bold inria-serif-bold">{bookDetails.title}</p>
              <p>Authors: {bookDetails.authors}</p>
              <p className="mb-2">
                Date published: {formatDate(bookDetails.date_published)}
              </p>
              <div className="flex grow prose w-full">
                {/*
                <ReactMarkdown>
                  {bookDetails.description || "No description available."}
                </ReactMarkdown> */}
                <div className="markdown-content">
                  {bookDetails.description || "No description available."}
                </div>
            </div>
          </div>
        </div>
        <div className="p-10 m-5 ml-10 mt-10 w-full flex flex-col border border-black rounded-sm shadow-xl">
          <Rating
            id={id}
            placeholder="Write a review!"
            media="book"
            avgRating={avgRating}
            reviews={reviews}
          >
            {/* need to change later*/}
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

export default BookReviewPage;
