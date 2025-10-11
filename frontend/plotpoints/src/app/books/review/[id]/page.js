"use client";

import { useState, useEffect } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";

import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";
import ReviewList from "../../../components/ReviewList";

import Image from "next/image";

function BookReviewPage({ params }) {
  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  console.log("Book ID from URL: " + id);
  //Book Details State
  const [bookDetails, setBookDetails] = useState(null);

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
        <div className="flex w-1/3 flex-initial flex-col items-center mt-10">
          <Image
            src={bookDetails.thumbnailUrl || ""}
            title={bookDetails.title || ""}
            alt={bookDetails.title || ""}
            className="w-65 h-96 rounded-xl outline-2 mb-5"
            width={1000}
            height={1000}
          />
            <p>Description:</p>
            <div className="p-4 border-2 h-1/2 rounded-xl w-auto my-2">
              <p className="text-lg">Title:</p>
              <p className="text-xl font-bold">{bookDetails.title}</p>
              <p>Authors: {bookDetails.authors}</p>
              <p className="mb-2">
                Date published: {bookDetails.date_published}
              </p>
              <div className="flex grow">
                <ReactMarkdown>
                  {bookDetails.description || "No description available."}
                </ReactMarkdown>
            </div>
          </div>
        </div>
        <div className="p-10 m-5 ml-10 mt-10 w-full flex flex-col border border-gray-500 rounded-xl shadow-xl">
          <Rating
            id={id}
            placeholder="Write a review!"
            media="movie"
            avgRating="4"
          >
            {/* need to change later*/}
          </Rating>
          <div>
            <p>Reviews:</p>
            <ReviewList></ReviewList>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookReviewPage;
