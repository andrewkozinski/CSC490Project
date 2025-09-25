"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextField from "../components/TextField";

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
      <Footer/>
    </div>
  );
}
