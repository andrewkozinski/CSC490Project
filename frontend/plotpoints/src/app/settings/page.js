"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Switch from "../components/Switch";
import "../components/Homepage.css";

export default function Settings() {
  return (
    <div>
      <Header></Header>
      <div className="flex items-center justify-center max-h-screen">
        <div className="w-3/4 h-full bottom-0 text-center mb-3 outline-transparent">
          <h1 className="text-3xl font-bold text-center mt-10">Settings</h1>
          <div className="flex flex-row w-full items-center justify-center gap-25 p-20">
            <h2 className="font-bold text-start">Review Text
              <p className="text-xs font-thin">Toggle off to display only rating values for media.</p>
            </h2>
            <Switch/>
          </div>
          
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
