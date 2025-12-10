"use client";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextField from "../components/TextField";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if(username.length > 20) {
      setError("Username must be less than 20 characters.")
    }

    if(!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    //Call into api/signup
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json(); //Get the json response

    if (!res.ok) {
      console.log(data.error);

      let message = "Signup failed";
      if (typeof data.error === "string") {
        message = data.error;
      } else if (Array.isArray(data.error)) {
        // If FastAPI has a validation error, it'll be an array of errors
        message = data.error.map((err) => err.msg).join(", ");
      } else if (typeof data.error === "object") {
        message = JSON.stringify(data.error);
      }

      setError(message);
      setLoading(false);
    } else {
      router.push("/signin"); // Redirect to sign-in page
    }
  };

  const handleEnterKey = (event) => {
    if(event.key === 'Enter') {
      event.preventDefault();
      handleSignUp(event);
    }
  };

  return (
    ////Flex box to make space for image on the right*/
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col gap-4 w-1/5">
          <h1 className="text-2xl inline-block text-center">Sign Up</h1>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold font-color text-left">
              Username
            </label>
            <input
              type="username"
              name="username"
              placeholder="Username"
              className="border blue shadow text-black p-4 border-transparent rounded-lg p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleEnterKey}
              maxLength={20}
            />
          </div>
          <TextField 
            label="Email" 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnterKey}
            maxLength={100}
          />
          <TextField 
            label="Password" 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleEnterKey}
          />
          <TextField 
            label="Confirm Password" 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleEnterKey}
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-center">
            <button
              className="brown text-black btn-shadow m-4 py-1 px-5 rounded-lg justify-center"
              onClick={loading ? undefined : handleSignUp}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
