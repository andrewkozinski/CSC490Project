"use client";
import { useSession } from "next-auth/react";
import Header from "../components/Header";

import Image from "next/image";
export default function SessionInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return (
    <>
      <p>No session found</p>
      <Image src="/images/sad-tenna.gif" alt="No session" width={500} height={300} />
    </>
  );

  return (
    <div>
      <Header/>
      <h3>Session Data:</h3>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Image 
        src="/images/spr_tenna_dance_cane_big.gif" 
        alt="Description of my image" 
        width={500} 
        height={300} 
      />
    </div>
  );
}