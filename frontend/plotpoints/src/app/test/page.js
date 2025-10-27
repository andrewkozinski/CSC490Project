"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Header from "../components/Header";
import Image from "next/image";
import Footer from "../components/Footer";
import { isBookmarked, getBookmarksByUserId } from "@/lib/bookmarks";

export default function SessionInfo() {
  const { data: session, status } = useSession();

  const [jwtResult, setJwtResult] = useState(null);

  const handleTestJwt = async () => {
    const token = session?.accessToken;
    try {
      const res = await fetch("https://beta-csc490project.onrender.com/auth/verifytoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      setJwtResult(data);
    } catch (err) {
      console.error(err);
      setJwtResult({ error: "Something went wrong" });
    }
  };

  const testFunction = async () => {
    //const res = await fetch("/api/tv/details/1405/stream_links");
    //const res = await fetch("/api/movies/details/634649/stream_links");
    //const data = await res.json();
    //console.log(data);
    const bookmarkId = 12; 
    console.log(await getBookmarksByUserId(1));
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center">
        {/*To explain how the ? operator works it checks the boolean value to the left of the equals
       If the value is true, it returns the value to the right of the colon. 
       If the value is false, it returns the value to the right of the colon.
       */}

        {status === "loading" ? 
        
        (
          /*Loading state*/
          <>
            <p>Loading...</p>
            <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
          </>
        ) 
        
        : !session ? //Not loading but now checks if there is a session
        
        (
          /*Not loading but no session state*/
          <>
            <p>No session found</p>
            <Image src="/images/sad-tenna.gif" alt="No session" width={500} height={300} />
          </>
        ) 
        : 
        (
          /*Not loading and there is an active user session*/
          <div className="flex flex-col items-center">
            <h3>Session Data:</h3>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <Image
              src="/images/spr_tenna_dance_cane_big.gif"
              alt="Description of my image"
              width={500}
              height={300}
            />
            <button
              onClick={() => signOut()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign out
            </button>

            <button
              onClick={handleTestJwt}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test JWT Token on Backend
            </button>
            {jwtResult && (
              <div className="mt-4 p-4 border rounded bg-gray-100">
                <h4>JWT Verification Result:</h4>
                <pre>{JSON.stringify(jwtResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )
        }
        {/* <Image src="https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/profiles/user_5_9d808a2d-5f50-4e3e-b120-f6b05414bcfa.jpg"
        width={250}
        height={250}
        alt={"Test Image from Oracle Cloud"}
        /> */}
        <button onClick={testFunction} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Testing Button (Bookmark related functions)</button>
      </div>
      <Footer />
    </>
  );
}