export async function deleteAccount(jwt_token) {
    try {
        const response = await fetch('/api/delete_account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jwt_token }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete account');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}