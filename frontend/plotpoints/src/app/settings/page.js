"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Switch from "../components/Switch";
import "../components/Homepage.css";

export default function Settings() {
  const [textToggle, setReviewText] = useState(
    () => localStorage.getItem("reviewText") === "true" || false
  );

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true" || false
  );

  useEffect(() => {
    console.log("Loaded from localStorage:", {
      reviewText: localStorage.getItem("reviewText"),
      darkMode: localStorage.getItem("darkMode")
    });
  }, []);

  useEffect(() => {
    const savedTextToggle = localStorage.getItem("reviewText");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedTextToggle !== null) {
      setReviewText(savedTextToggle === "true");
    }
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reviewText", textToggle);
  }, [textToggle]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center max-h-screen">
        <div className="w-3/4 h-full bottom-0 text-center mb-3 outline-transparent">
          <h1 className="text-3xl font-bold text-center mt-10">Settings</h1>

          <div className="flex flex-row w-full items-center justify-center gap-25 p-20">
            <h2 className="font-bold text-start">Review Text
              <p className="text-xs font-thin">Disable to display only rating values for media.</p>
            </h2>
            <Switch
              isOn={textToggle}
              handleToggle={() => {
                console.log("Review Text Toggle:", !textToggle);
                setReviewText(!textToggle)
              }
              }>
            </Switch>
          </div>
          <div className="flex flex-row w-full items-center justify-center gap-38 p-5">
            <h2 className="font-bold text-start">Dark Mode
              <p className="text-xs font-thin">Toggle to activate dark mode</p>
            </h2>
            <Switch
              isOn={darkMode}
              handleToggle={() => {
                console.log("Dark Mode Toggle:", !darkMode);
                setDarkMode(!darkMode);
              }}
            />

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
