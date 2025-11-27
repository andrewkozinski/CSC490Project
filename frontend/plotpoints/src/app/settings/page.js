"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Switch from "../components/Switch";
import Modal from "../components/EditModal";
import "../components/Homepage.css";
import { useSession } from "next-auth/react";
import { getUserSettings, updateReviewTextSetting, updateDarkModeSetting } from "@/lib/settings";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [textToggle, setReviewText] = useState(false);
  const [loaded, setLoaded] = useState(false); //needed to set the toggles according to localStorage
  const { data: session} = useSession();

  //For delete account modal
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    console.log("Loaded from localStorage:", {
      reviewText: localStorage.getItem("reviewText"),
      darkMode: localStorage.getItem("darkMode")
    });
  }, []);

  //Grab initial review text & and dark mode setting from server
  useEffect(() => {
    const fetchSetting = async () => {
      if (session?.accessToken) {
        const isEnabled = await getUserSettings(session.accessToken);
        console.log("Fetched settings from server:", isEnabled);
        setReviewText(isEnabled.review_text_enabled);
        localStorage.setItem("reviewText", isEnabled.review_text_enabled);
        setDarkMode(isEnabled.dark_mode_enabled);
        localStorage.setItem("darkMode", isEnabled.dark_mode_enabled);
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

  //Use effect logic was causing some weird bugs, so commenting out for now
  
  // useEffect(() => {
  //   if (loaded) {
  //   localStorage.setItem("reviewText", textToggle);
  //   console.log("reviewText set: ", textToggle);
  //   }
  // }, [textToggle, loaded]);

  // useEffect(() => {
  //   if (loaded) {
  //   localStorage.setItem("darkMode", darkMode);
  //   console.log("darkMode set: ", darkMode)
  //   }
  // }, [darkMode, loaded]);

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
                const updateSetting = async (newValue) => {
                  if (session?.accessToken) {
                    const result = await updateReviewTextSetting(newValue, session.accessToken);
                    console.log("Review text setting updated on server:", result);
                  }
                  
                };
                updateSetting(!textToggle);
                setReviewText(!textToggle)
                localStorage.setItem("reviewText", !textToggle);
              }
              }>
            </Switch>
          </div>
          <div className="flex flex-row w-full items-center justify-center gap-38 p-5 pb-20">
            <h2 className="font-bold text-start">Dark Mode
              <p className="text-xs font-thin">Toggle to activate dark mode</p>
            </h2>
            <Switch
              isOn={darkMode}
              handleToggle={() => {
                console.log("Dark Mode Toggle:", !darkMode);
                const updateSetting = async (newValue) => {
                  console.log("Updating dark mode to:", newValue);
                  if (session?.accessToken) {
                    const result = await updateDarkModeSetting(newValue, session.accessToken);
                    console.log("Dark mode setting updated on server:", result);
                  }
                };
                updateSetting(!darkMode);
                setDarkMode(!darkMode);
                localStorage.setItem("darkMode", !darkMode);
              }}
            />

          </div>
          <div className="flex flex-row w-full items-center justify-center gap-38 p-5 pb-20">
            {/* <h2 className="font-bold text-start">Delete Account
              <p className="text-xs font-thin">Description</p>
            </h2> */}
            <button
              className="red text-black shadow m-4 px-4 py-2 rounded-lg hover:cursor-pointer"
              onClick={() => setShowModal(true)}> 
              {showModal &&
              <Modal>
                <h1 className="text-2xl text-center">Delete Account</h1>
                  <div className="flex flex-col w-full">   
                    <h2 className="font-bold p-10">
                      Are you sure? 
                    </h2>
                    <p className="pb-10">
                      You will no longer be able to view any of your account information or access it.<br/>
                      Your bookmarks and favorites will be lost.<br/>
                    </p>
                    <div className="flex flex-row w-full justify-around items-center">
                      <button
                        className="blue text-sm text-black shadow m-4 py-1 px-5 w-fit rounded-sm place-self-center"
                        onClick={() => setShowModal(false)}>        
                                        
                        Cancel 
                      </button>
                      <button
                        className="blue text-sm text-black shadow m-4 py-1 px-5 w-fit rounded-sm place-self-center"
                        onClick={() => setShowModal(false)}>        
                                        
                        Confirm 
                      </button>
                    </div>
                  </div>
              </Modal>
              }
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
