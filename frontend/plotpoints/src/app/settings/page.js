"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GenreContainer from "../components/GenreContainer";
import Image from "next/image";
import Review from "../components/HomepageReview";
import "../components/Homepage.css";

export default function Home() {
  return (
    <div>
      <Header></Header>
      <div className="flex items-center justify-center h-screen">
        <div className="w-3/4 h-full bottom-0 text-center shadow-lg mb-3 outline-transparent">
          <h1 className="text-3xl font-bold text-center mt-10">Settings</h1>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
