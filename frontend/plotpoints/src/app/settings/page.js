"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GenreContainer from "../components/GenreContainer";
import Image from "next/image";
import Review from "../components/HomepageReview";
import '../components/Homepage.css';


export default function Home() {
return(
    <div>
    <Header></Header>
    <p>Settings!</p>
    <Footer></Footer>
    </div>
);
}