"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Switch from "../components/Switch";
import Modal from "../components/Modal";
import "../components/Homepage.css";
import { useSession } from "next-auth/react";
import { deleteAccount } from "@/lib/delete";
import { signOut } from "next-auth/react";
import { useSettings } from "../context/SettingsProvider";

export default function Settings() {
  const { data: session } = useSession();
  const { darkMode, reviewText, setDarkMode, setReviewText } = useSettings();

  //For delete account modal
  const [showModal, setShowModal] = useState(false);

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
              isOn={reviewText}
              handleToggle={() => {
                console.log("Review Text Toggle:", !reviewText);
                setReviewText(!reviewText);
              }}
            />
          </div>

          <div className="flex flex-row w-full items-center justify-center gap-38 p-5 pb-20">
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

          <div className="flex flex-row w-full items-center justify-center gap-38 p-5 pb-20">
            <button
              className="red text-black shadow m-4 px-4 py-2 rounded-lg hover:cursor-pointer"
              onClick={() => setShowModal(true)}>
              Delete Account
            </button>

            {showModal &&
              <Modal onClose={() => setShowModal(false)}>
                <h1 className="text-2xl text-center">Delete Account</h1>
                <div className="flex flex-col w-full">
                  <h2 className="font-bold p-10">
                    Are you sure?
                  </h2>
                  <p className="pb-10">
                    Your profile will no longer be visible.<br/>
                    Your bookmarks and favorites will be lost.<br/>
                    Your reviews and comments will be viewable but not accessible.
                  </p>
                  <div className="flex flex-row w-full justify-around items-center">
                    <button
                      className="blue text-sm text-black shadow m-4 py-1 px-5 w-fit rounded-sm place-self-center"
                      onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button
                      className="red text-sm text-black shadow m-4 py-1 px-5 w-fit rounded-sm place-self-center"
                      onClick={async () => {
                        setShowModal(false);
                        if (session?.accessToken) {
                          try {
                            const result = await deleteAccount(session.accessToken);
                            console.log("Account deleted:", result);
                            await signOut();
                            window.location.href = "/";
                          } catch (error) {
                            console.error("Error deleting account:", error);
                          }
                        }
                      }}>
                      Confirm
                    </button>
                  </div>
                </div>
              </Modal>
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}