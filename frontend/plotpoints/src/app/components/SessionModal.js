import Modal from "@/app/components/Modal";
import Link from "next/link";
import "./Header.css";
import { signOut } from "next-auth/react";
import { sign } from "crypto";

export default function SessionModal({ onClose, setShowExpiredSessionModal }) {
    return (
        <Modal onClose={onClose}>
            <h1 className="text-2xl text-center">Expired Session</h1>
            <div className="flex flex-col w-full">   
                <p className="pb-10 pt-10 text-center">
                You must be signed in to continue.
                </p>
                <div className="flex flex-row justify-center items-center pb-5">
                    <Link className="text fields blue btn-shadow mr-10 mt-1" href="/signup" onClick={() => {
                        signOut({"callbackUrl": "/signup"});
                        setShowExpiredSessionModal(false);
                    }}>Sign Up</Link>
                    <Link className="text fields blue btn-shadow -ml-5" href="/signin" onClick={() => {
                        signOut({"callbackUrl": "/signin"});
                        setShowExpiredSessionModal(false);
                    }}>Sign In</Link>
                </div>

            </div>
        </Modal>
    );
}