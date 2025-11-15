
export const getNotifications = async (userId) => {
    const res = await fetch(`/api/notifications/get/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch notifications');
    }

    const data = await res.json();
    return data;
};

export const getNotifCount = async (userId) => {
    const res = await fetch(`/api/notifications/get/${userId}/count`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch notification count');
    }
    const data = await res.json();
    return data;
}