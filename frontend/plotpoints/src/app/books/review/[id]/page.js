"use client";

import { useState, useEffect } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";

import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";
import ReviewList from "../../../components/ReviewList";

import Image from "next/image";

import fetchReviews from "@/utils/fetchReviews";
import fetchAvgRating from "@/utils/fetchAvgRating";

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

  // Need to fetch data using this ID to get the details of the book
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/books/details/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        console.log("Fetched Book Details:", data);
        setBookDetails(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
    fetchReviews("book", id, setReviews);
    fetchAvgRating("books", id, setAvgRating);
  }, [id]);

  if (!bookDetails) {
    return (
      <>
        <Header />
        <p>Loading Book Details...</p>
      </>
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
        <div className="p-10 m-5 ml-10 mt-10 w-full flex flex-col border border-gray-500 rounded-sm shadow-xl">
          <Rating
            id={id}
            placeholder="Write a review!"
            media="book"
            avgRating={avgRating}
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
