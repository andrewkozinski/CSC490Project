"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Switch from "../components/Switch";
import "../components/Homepage.css";

export default function Settings() {
  const [textToggle, setReviewText] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div>
      <Header/>
      <div className="flex items-center justify-center max-h-screen">
        <div className="w-3/4 h-full bottom-0 text-center mb-3 outline-transparent">
          <h1 className="text-3xl font-bold text-center mt-10">Settings</h1>

          <div className="flex flex-row w-full items-center justify-center gap-25 p-20">
            <h2 className="font-bold text-start">Review Text
              <p className="text-xs font-thin">Disable to display only rating values for media.</p>
            </h2>
            <Switch 
              isOn={textToggle}
              handleToggle={() => setReviewText(!textToggle)}>
            </Switch>
          </div>
          {/* <div className="flex flex-row w-full items-center justify-center gap-45 p-5">
            <h2 className="font-bold text-start">Dark Mode
              <p className="text-xs font-thin">Description</p>
            </h2>
            <Switch 
              isOn={darkMode}
              handleToggle={() => setDarkMode(!darkMode)}>
            </Switch>
          </div> */}
          <button
              // onClick={loading ? undefined : handleSignIn}
              className="brown text-black shadow m-4 py-1 px-5 rounded-lg hover:cursor-pointer"
            >
            Save
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
