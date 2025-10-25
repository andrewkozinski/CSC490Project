export async function getFollowing(userId) {
    const res = await fetch(`/api/following/${userId}/get_following`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch following list');
    }
    const data = await res.json();
    return data;
}

export async function getFollowers(userId) {
    const res = await fetch(`/api/following/${userId}/get_followers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch followers list');
    }
    const data = await res.json();
    return data;
}

export async function isFollowing(followId, jwtToken) {
    const res = await fetch(`/api/following/is_following/${followId}?jwt_token=${encodeURIComponent(jwtToken)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to check following status');
    }
    const data = await res.json();
    return data;
}

export async function followUser(followId, jwtToken) {
    const res = await fetch(`/api/following/follow/${followId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ follow_id: followId, jwt_token: jwtToken }),
    });
    if (!res.ok) {

        if (res.status === 401) {
            alert("Session expired. Please log in again.");
            throw new Error('Unauthorized');
        }

        throw new Error('Failed to follow user');
    }
    const data = await res.json();
    return data;
}

export async function unfollowUser(followId, jwtToken) {
    const res = await fetch(`/api/following/unfollow/${followId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ follow_id: followId, jwt_token: jwtToken }),
    });
    if (!res.ok) {
        if (res.status === 401) {
            alert("Session expired. Please log in again.");
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to unfollow user');
    }
    const data = await res.json();
    return data;
}