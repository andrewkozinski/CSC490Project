"use client";
import { useState } from "react";
import Header from "../components/Header";
import TextField from "../components/TextField";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        console.log(data)
        setLoading(false);
        return;
      }

      // Handle successful login logic should go here
      console.log("Login successful:", data);
      setLoading(false);
      // Redirect the user after login most likely
    } catch (err) {
      setError(`Network Error: ${err.message}`);
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col gap-4 w-1/4">
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
          {error && <p className="text-red-500">{error}</p>}
          <p
            className={`mt-4 text-blue-500 cursor-pointer hover:underline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={loading ? undefined : handleSignIn}
          >
            {loading ? "Submitting..." : "Submit"}
          </p>
        </div>
      </div>
    </div>
  );
}
