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
    
    const data = await res.json();//Get the json response
    
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
    } 
    else {
      router.push("/signin"); // Redirect to sign-in page
    }
  };

  return (
    ////Flex box to make space for image on the right*/
    <div>
      <Header />
      <div className="flex min-h-screen mt-20 mx-20">
        <div className="flex flex-col gap-2">
          <TextField 
            label="Username" 
            type="text" 
            name="username" 
            placeholder="Enter your username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField 
            label="Email" 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField 
            label="Password" 
            type="password" 
            name="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField 
            label="Re-Enter Password" 
            type="password" 
            name="confirmPassword" 
            placeholder="Re-enter your password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <p 
            className={`text-blue-500 cursor-pointer hover:underline ${loading ? "opacity-50 pointer-events-none" : ""}`}
            onClick={handleSignUp}
          >
            {loading ? "Submitting..." : "Submit"}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
