"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/SessionModal";


export default function About() {

  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Header/>
        {/* <button
              className="red text-black shadow m-4 px-4 py-2 rounded-lg hover:cursor-pointer"
              onClick={() => setShowModal(true)}> 
              Expired Session
        </button>
        {showModal && <Modal/>} */}
        <div className="flex items-center justify-center max-h-screen">
        <div className="w-3/4 h-full bottom-0 text-center mb-3 outline-transparent">
          <h1 className="text-3xl font-bold text-center p-10">About</h1>
          <div className="flex justify-center">
            <p className="text-md w-3/5 text-center">
              {`Thank you for visiting `}
              <span className="inria-serif-regular">PLOT POINTS!</span> 
              {` We created this site as a unified place to review media. 
              There are countless pieces of media that are all trying to
              gain out attention. What should be spend our time on? We 
              hope to help you have an easier time of deciding!`}
            </p> 
            
          </div>
          
          
        </div>
        </div>      
      <Footer/>
    </div>
  );
}