"use client";
import { useSession } from "next-auth/react";

export default function SessionInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>No session found</p>;

  return (
    <div>
      <h3>Session Data:</h3>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}