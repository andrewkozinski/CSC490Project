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
            {/*For now, we're just displaying the results. Nothing fancy, search bar should be in here in future*/}

            

            <Footer />
        </div>
    );
}