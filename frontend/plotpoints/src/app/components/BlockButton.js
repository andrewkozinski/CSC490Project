"use client";

import { useState, useEffect } from "react";
import { blockUser, unblockUser, isBlocked } from "@/lib/blocking";
import Modal from "./Modal";

export default function BlockButton({ profileId, currentUserId, jwtToken }) {
    const [isUserBlocked, setIsUserBlocked] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (profileId == currentUserId) return;
        if (!jwtToken) return;
        if (!currentUserId) return;
        if (isJwtExpired(jwtToken)) return;

        const checkBlockedStatus = async () => {
            try {
                const data = await isBlocked(profileId, currentUserId);
                console.log("Block check:", data);
                setIsUserBlocked(data.is_blocked);
            } catch (err) {
                console.error("Error checking block status:", err);
            }
        };

        checkBlockedStatus();
    }, [profileId, currentUserId, jwtToken]);

    if (!isUserBlocked && profileId != currentUserId && jwtToken) {
        return (
            <>
                <button
                    onClick={() => setShowConfirm(true)}
                    className="px-4 py-2 rounded text-white flex flex-row justify-center transition cursor-pointer bg-red-600 hover:bg-red-700 h-10"
                >
                    {/* Block icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <p>Block</p>
                </button>

                {showConfirm && (
                    <Modal
                        title="Block User?"
                        onClose={() => setShowConfirm(false)}
                    >
                        <p className="text-center mb-4">
                            Are you sure you want to block this user?
                        </p>

                        <div className="flex gap-4 justify-center">
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={async () => {
                                    await blockUser(profileId, jwtToken);
                                    window.location.reload();
                                }}
                            >
                                Yes, Block
                            </button>

                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </Modal>
                )}
            </>
        );
    }

    if (isUserBlocked && profileId != currentUserId) {
        return (
            <button
                onClick={async () => {
                    await unblockUser(profileId, jwtToken);
                    window.location.reload();
                }}
                className="px-4 py-2 rounded text-white flex flex-row justify-center transition cursor-pointer bg-gray-600 hover:bg-gray-700 h-10"
            >
                {/* Unblock icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 mr-1"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m-7.5-7.5V19.5" />
                </svg>
                <p>Unblock</p>
            </button>
        );
    }

    if (isJwtExpired(jwtToken)) return null;

    return null;
}

function isJwtExpired(token) {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;

    return Date.now() > expiry;
}