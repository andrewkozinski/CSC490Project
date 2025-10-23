"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";


export default function Home() {

    //Get search query from URL
    const { query } = useParams();
    console.log("Search query:", query);

    return (
        <div>
            <Header />
            <p>No search query provided</p>
            <p>In the future, probably will have a search bar here with filters and stuff</p>
            <p>Frontend people, do your thing lol</p>
            <Footer />
        </div>
    );
}