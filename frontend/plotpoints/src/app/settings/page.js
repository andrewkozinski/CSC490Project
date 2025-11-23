"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Switch from "../components/Switch";
import "../components/Homepage.css";
import { useSession } from "next-auth/react";
import { isReviewTextEnabled, updateReviewTextSetting } from "@/lib/settings";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [textToggle, setReviewText] = useState(true);
  const [loaded, setLoaded] = useState(false); //needed to set the toggles according to localStorage
  const { data: session} = useSession();

  useEffect(() => {
    console.log("Loaded from localStorage:", {
      reviewText: localStorage.getItem("reviewText"),
      darkMode: localStorage.getItem("darkMode")
    });
  }, []);

  //Grab initial review text setting from server
  useEffect(() => {
    const fetchSetting = async () => {
      if (session?.accessToken) {
        const isEnabled = await isReviewTextEnabled(session.accessToken);
        console.log("Fetched review text setting from server:", isEnabled);
        setReviewText(isEnabled.review_text_enabled);
        localStorage.setItem("reviewText", isEnabled.review_text_enabled);
      }
    };
    fetchSetting();
  }, [session]);

  useEffect(() => {
    const savedDark = localStorage.getItem("darkMode");
    const savedReview = localStorage.getItem("reviewText");

    if (savedDark !== null) setDarkMode(savedDark === "true");
    if (savedReview !== null) setReviewText(savedReview === "true");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
    localStorage.setItem("reviewText", textToggle);
    console.log("reviewText set: ", textToggle);
    }
  }, [textToggle, loaded]);

  useEffect(() => {
    if (loaded) {
    localStorage.setItem("darkMode", darkMode);
    console.log("darkMode set: ", darkMode)
    }
  }, [darkMode, loaded]);

  // Update review text setting on the server when toggled
  // useEffect(() => {
  //   const updateSetting = async () => {
  //     if (session?.accessToken) {
  //       const result = await updateReviewTextSetting(textToggle, session.accessToken);
  //       console.log("Review text setting updated on server:", result);
  //     }
  //   };
  //   updateSetting();
  // }, [textToggle, session]);

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
                const updateSetting = async () => {
                  if (session?.accessToken) {
                    const result = await updateReviewTextSetting(!textToggle, session.accessToken);
                    console.log("Review text setting updated on server:", result);
                  }
                };
                updateSetting();
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
