"use client";
import Footer from "../components/Footer";
import Header from "../components/Header";
import React from "react";

export default function App() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "05d49b56-ff89-4f37-b0b8-8b9f3f99e0f5");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted!");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 justify-center items-center">
          <div className="flex flex-col w-2/6">
            <h1 className="text-2xl inline-block text-center">Contact Us</h1>
            <form className="flex flex-col gap-2"onSubmit={onSubmit}>
              <label htmlFor="name" className="text-sm font-bold text-gray-700 text-left">Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="Name"
                className="border bg-[#b0e0e68f] shadow text-black p-4 border-transparent rounded-lg p-2"/>
              <label htmlFor="email" className="text-sm font-bold text-gray-700 text-left">Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                required
                className="border bg-[#b0e0e68f] shadow text-black p-4 border-transparent rounded-lg p-2"/>            
              <label htmlFor="message" className="text-sm font-bold text-gray-700 text-left">Message</label>
              <textarea 
                name="message" 
                placeholder="Write your message" 
                required
                className="border bg-[#b0e0e68f] shadow text-black p-4 border-transparent rounded-lg p-2">
              </textarea>
              <button 
              type="submit" 
              className="brown text-black shadow m-5 py-1 px-5 rounded-lg max-w-fit place-self-center">
              Submit
              </button>
            </form>
            
        <span className="place-self-center">{result}</span>

      </div>
      </div>
      <Footer/>
    </div>

  );
}

