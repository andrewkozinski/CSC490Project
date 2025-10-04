"use client";

import { useState, useEffect} from "react";
import React from "react";

import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import Rating from "../../../components/Rating";

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
          <img
            src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg"
            title="Kpop Demon Hunters"
            className="w-65 h-96 rounded-xl outline-2 mb-5"
          />
          <p>Your Rating</p>
          <Rating />
          <p>Reader Rating</p>
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
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

export default BookReviewPage;
