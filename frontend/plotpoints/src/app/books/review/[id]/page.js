"use client";

import { useState, useEffect} from "react";
import React from "react";

import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";

import Image from "next/image";

function BookReviewPage({params}) {

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
  }, []);

  if(!bookDetails) {
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
        <div className="flex w-1/3 flex-initial flex-col items-center justify-center">
          <Image
            src={bookDetails.thumbnailExtraLargeUrl || ""}
            title={bookDetails.title || ""}
            alt={bookDetails.title || ""}
            className="w-65 h-96 rounded-xl outline-2 mb-5"
            width={1000}
            height={1000}
          />
          <Rating
            id = {id}
            placeholder="Write a review!"
            media="book"
            avgRating= "4"> {/* need to change later*/}
          </Rating>
        </div>
        <div className="flex flex-col justify-end w-2/3 h-1/2 flex-initial">
          <p>Description:</p>
          {/*<p className="p-4 border-2 h-1/2 rounded-xl w-auto my-2">
            {bookDetails.description || "No description available."}
          </p>*/}
          <div
          className="p-4 border-2 h-1/2 rounded-xl w-auto my-2"
          dangerouslySetInnerHTML={{ // Google boooks API returns HTML in description, so it needs to be rendered as HTML
            __html: bookDetails.description || "No description available.",
            }}
            />
          <div>
            <p>Comments:</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookReviewPage;
