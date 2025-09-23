"use client";
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


  const handleSignUp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Something went wrong");
        console.log(data)
        setLoading(false);
        return;
      }

      // Handle successful login logic should go here
      console.log("Login successful:", data);
      setLoading(false);
      // Redirect the user after login most likely, use router probably for the best
      
      router.push("/"); // Redirect to homepage or any other page
    } catch (err) {
      setError(`Network Error: ${err.message}`);
      console.log(err);
      setLoading(false);
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
          <p 
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={loading ? undefined : handleSignUp}
          >
          {loading ? "Submitting..." : "Submit"}
          </p>
          
        </div>
      </div>
    </div>
    );
}