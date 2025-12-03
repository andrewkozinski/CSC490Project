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
        <button
              className="red text-black shadow m-4 px-4 py-2 rounded-lg hover:cursor-pointer"
              onClick={() => setShowModal(true)}> 
              Expired Session
        </button>
        {showModal && <Modal/>}
      <Footer/>
    </div>
  );
}