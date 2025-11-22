export const blockUser = async (userId, jwtToken) => {
    try {
        const res = await fetch(`/api/blocking/block/${encodeURIComponent(userId)}`, {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jwt_token: jwtToken }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to block user');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error blocking user:', error);
    }
};


export const unblockUser = async (userId, jwtToken) => {
    try {
        const res = await fetch(`/api/blocking/unblock/${encodeURIComponent(userId)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jwt_token: jwtToken }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to unblock user');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error unblocking user:', error);
    }
};

/**
 * 
 * @param {*} checkingBlocked The user ID that's being checked to see if they are blocked by the current user
 * @param {*} currentUserId The user ID of the current user
 * @returns 
 */
export const isBlocked = async (checkingBlocked, currentUserId) => {
    try {
        const res = await fetch(`/api/blocking/is_blocked/${encodeURIComponent(checkingBlocked)}?current_user_id=${encodeURIComponent(currentUserId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to check block status');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error checking block status:', error);
    }
};