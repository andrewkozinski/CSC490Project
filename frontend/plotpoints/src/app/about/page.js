"use client";
import { useSession, signOut } from "next-auth/react";
import Header from "../components/HeaderSignedIn";
import Footer from "../components/Footer";


export default function About() {
  const { data: session, status } = useSession();
  
  return (
    <div>
      <Header/>
      <Footer/>
    </div>
  );
}