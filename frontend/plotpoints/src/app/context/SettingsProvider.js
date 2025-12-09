import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { getUserSettings, updateReviewTextSetting, updateDarkModeSetting } from "@/lib/settings";
import SessionModal from "../components/SessionModal";
import { useRef } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [reviewText, setReviewText] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showExpiredSessionModal, setShowExpiredSessionModal] = useState(false);
  const expiryTimerRef = useRef(null);

  //initialize from localStorage
  useEffect(() => {
    const savedDark = localStorage.getItem("darkMode");
    const savedReview = localStorage.getItem("reviewText");
    if (savedDark !== null) setDarkMode(savedDark === "true");
    if (savedReview !== null) setReviewText(savedReview === "true");
    setLoaded(true);
  }, []);

  //Fetch from backend when logged in (overwrites the localStorage values if server returns)
  useEffect(() => {
    async function fetchSettings() {
      if (!session?.accessToken) return;
      try {
        const s = await getUserSettings(session.accessToken);
        if (s) {
          setReviewText(Boolean(s.review_text_enabled));
          localStorage.setItem("reviewText", Boolean(s.review_text_enabled));
          setDarkMode(Boolean(s.dark_mode_enabled));
          localStorage.setItem("darkMode", Boolean(s.dark_mode_enabled));
        }
      } catch (e) {
        console.error("Failed to fetch settings:", e);
        if(e?.response?.status === 401) {
          // Unauthorized, likely due to expired token
          setShowExpiredSessionModal(true);
        }
      }
    }
    fetchSettings();
  }, [session]);

  //apply dark mode class
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  //Functions to toggle settings
  const toggleDark = useCallback(async (value) => {
    const newVal = typeof value === "boolean" ? value : !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("darkMode", newVal);
    if (session?.accessToken) {
      try { await updateDarkModeSetting(newVal, session.accessToken); } catch (e) { console.error(e); }
    }
  }, [darkMode, session]);

  const toggleReviewText = useCallback(async (value) => {
    const newVal = typeof value === "boolean" ? value : !reviewText;
    setReviewText(newVal);
    localStorage.setItem("reviewText", newVal);
    if (session?.accessToken) {
      try { await updateReviewTextSetting(newVal, session.accessToken); } catch (e) { console.error(e); }
    }
  }, [reviewText, session]);

  //Function to reset settings to defaults
  const resetSettings = useCallback(() => {
    toggleDark(false);
    toggleReviewText(true);
    localStorage.setItem("darkMode", false);
    localStorage.setItem("reviewText", true);
  }, []);

  //Reset to defaults on logout
  useEffect(() => {
    if (!session) {
      resetSettings();
    }
  }, [session, resetSettings]);

  //Check if the JWT token has expired
  // useEffect(() => {
  //   if (!session?.accessToken) return;

  //   const { exp } = JSON.parse(atob(session.accessToken.split(".")[1]));
  //   console.log("Token expiration time (epoch):", exp);
  //   const now = Date.now() / 1000;

  //   if (now >= exp) {
  //     console.log("Session has expired, showing modal.");
  //     setShowExpiredSessionModal(true);
  //   }
  // }, [session, session?.accessToken, reviewText, darkMode]);

  //Timer to show modal 5 seconds before expiration
  useEffect(() => {
    if (!session?.accessToken) return;

    // clear any previous timer
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }

    let expSec;
    try {
      const payload = JSON.parse(atob(session.accessToken.split(".")[1]));
      expSec = payload?.exp;
    } catch (e) {
      console.error("Failed to parse JWT:", e);
    }
    if (!expSec) return;

    const msToExpiry = expSec * 1000 - Date.now() - 5000; // 5s early
    if (msToExpiry <= 0) {
      setShowExpiredSessionModal(true);
      return;
    }

    expiryTimerRef.current = setTimeout(() => {
      setShowExpiredSessionModal(true);
    }, msToExpiry);

    return () => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    };
  }, [session?.accessToken]);



  return (
    <SettingsContext.Provider value={{
      darkMode,
      reviewText,
      loaded,
      setDarkMode: toggleDark,
      setReviewText: toggleReviewText,
      resetSettings: resetSettings,
      setShowExpiredSessionModal: setShowExpiredSessionModal,
    }}>
      {children}
      {showExpiredSessionModal && (
        <SessionModal onClose={() => {
          setShowExpiredSessionModal(false); 
          //Now sign out the user
          signOut();
          resetSettings();
          }} 
          setShowExpiredSessionModal={setShowExpiredSessionModal} 
          />
      )}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}