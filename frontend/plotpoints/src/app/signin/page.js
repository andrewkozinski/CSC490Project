"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextField from "../components/TextField";
import "../components/Homepage.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setLoading(false);
      setError("Invalid email or password");
    } else {
      setLoading(false);
      router.push("/"); // Redirect to home
    }
  };

  const handleEnterKey = (event) => {
    //console.log("Key pressed:", event.key);
    if(event.key === 'Enter') {
      event.preventDefault();
      console.log("Enter key detected, submitting form");
      handleSignIn(event);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col gap-4 w-1/5">
          <h1 className="text-2xl inline-block text-center">Sign In</h1>
          <TextField
            type="email"
            name="email"
            label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnterKey}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleEnterKey}
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-center">
            <button
              onClick={loading ? undefined : handleSignIn}
              className="brown text-black btn-shadow m-4 py-1 px-5 rounded-lg"
              disabled={loading}
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
