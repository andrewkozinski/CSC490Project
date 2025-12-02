import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getUserSettings, updateReviewTextSetting, updateDarkModeSetting } from "@/lib/settings";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [reviewText, setReviewText] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
      }
    }
    fetchSettings();
  }, [session]);

  //apply dark mode class
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
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

  return (
    <SettingsContext.Provider value={{
      darkMode,
      reviewText,
      loaded,
      setDarkMode: toggleDark,
      setReviewText: toggleReviewText
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}