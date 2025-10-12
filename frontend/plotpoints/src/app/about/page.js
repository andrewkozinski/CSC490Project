"use client";
import { useSession, signOut } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function About() {

  return (
    <div>
      <Header/>
      <Footer/>
    </div>
  );
}