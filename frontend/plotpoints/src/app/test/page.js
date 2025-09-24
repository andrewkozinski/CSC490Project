"use client";
import { useSession, signOut } from "next-auth/react";
import Header from "../components/Header";
import Image from "next/image";

export default function SessionInfo() {
  const { data: session, status } = useSession();

  return (
    <>
      <Header/>
      {/*To explain how the ? operator works it checks the boolean value to the left of the equals
       If the value is true, it returns the value to the right of the colon. 
       If the value is false, it returns the value to the right of the colon.
       */}
      {status === "loading" ? (
        <>
          <p>Loading...</p>
          <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
        </>
      ) : !session ? (
        <>
          <p>No session found</p>
          <Image src="/images/sad-tenna.gif" alt="No session" width={500} height={300} />
        </>
      ) : (
        <div>
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
        </div>
      )}
    </>
  );
}