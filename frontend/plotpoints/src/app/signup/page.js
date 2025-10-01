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

  const handleSignUp = async (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();

    //Call into api/signup
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json(); //Get the json response

    if (!res.ok) {
      setError(data.error || "Signup failed");
      setLoading(false);
    } else {
      router.push("/signin"); // Redirect to sign-in page
    }
  };

  return (
    ////Flex box to make space for image on the right*/
    <div>
      <Header />
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col gap-4 w-full max-w-sm w-1/5">
          <TextField
            label="Username"
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField 
            label="Email" 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          <TextField 
            label="Password" 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField 
            label="Re-Enter Password" 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-center">
            <button
              className="brown border-grey-300 m-4 text-black py-2 px-4 rounded-lg justify-center"
              onClick={loading ? undefined : handleSignUp}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
    );
}