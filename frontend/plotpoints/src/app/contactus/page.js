"use client";
import Footer from "../components/Footer";
import Header from "../components/Header";
import React from "react";
import TextField from "../components/TextField";

// export default function Contact() {
//   const [result, setResult] = React.useState("");

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     setResult("Sending....");
//     const formData = new FormData(event.target);

//     formData.append("access_key", "05d49b56-ff89-4f37-b0b8-8b9f3f99e0f5");

//     const response = await fetch("https://api.web3forms.com/submit", {
//       method: "POST",
//       body: formData
//     });

//     const data = await response.json();

//     if (data.success) {
//       setResult("Form Submitted Successfully");
//       event.target.reset();
//     } else {
//       console.log("Error", data);
//       setResult(data.message);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header/>
//       <div className="flex justify-center">
//         <div className="flex flex-col gap-4 w-1/6">
//           <h1 className="text-2xl inline-block text-center">Contact Us</h1>  
//           <input 
//               type="text" 
//               name="name"
//               placeholder="Name"
//               className="border blue shadow text-black p-4 border-transparent rounded-lg p-2">
//           </input>
//           <input 
//             type="text" 
//             name="email"
//             placeholder="Email"
//             className="border blue shadow text-black p-4 border-transparent rounded-lg p-2"
//             required >
//           </input>
//           <textarea 
//             name="message"              
//             className="border blue shadow text-black p-4 border-transparent rounded-lg p-2"
//             required >
//           </textarea>
//           <button
//               onClick={onSubmit}
//               className="brown text-black shadow m-4 py-2 px-6 rounded-lg justify center"
//               >
//           </button>
//         </div>
//       </div>
//       <Footer/>
//     </div>
//   );
// }


function App() {
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
      setResult("Form Submitted Successfully");
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
          <div className="flex flex-col gap-4 w-1/6">
          <h1 className="text-2xl inline-block text-center">Contact Us</h1>
        <form className="flex flex-col"onSubmit={onSubmit}>
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            name="name" 
            required 
            placeholder="Name"
            className="border bg-[#b0e0e68f] shadow text-black p-4 border-transparent rounded-lg p-2"/>
          <input type="email" name="email" placeholder="Email" required/>
          <textarea name="message" placeholder="Write your message" required></textarea>

          <button type="submit">Submit Form</button>

        </form>
        <span>{result}</span>

      </div>
      </div>
      <Footer/>
    </div>

  );
}

export default App;
