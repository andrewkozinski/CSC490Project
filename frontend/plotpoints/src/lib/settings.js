/**
 * Checks if review text setting is enabled for the user
 * @param {*} jwt JWT Token of the user 
 * @returns 
 */
export const getUserSettings = async (jwt) => {
    try {
        const res = await fetch(`/api/settings/review_text/is_enabled/${encodeURIComponent(jwt)}`);
        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error fetching review text setting:', errorData.error || 'Unknown error');
            return false;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching review text setting:', error);
        return false;
    }
};

/**
 * Updates the review text setting for the user
 * @param {*} review_text_setting New setting value (true/false)
 * @param {*} jwt_token JWT Token of the user
 * @returns 
 */
export const updateReviewTextSetting = async (review_text_setting, jwt_token) => {
    try {
        const res = await fetch(`/api/settings/review_text/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ review_text_setting, jwt_token }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error updating review text setting:', errorData.error || 'Unknown error');
            return false;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error updating review text setting:', error);
        return false;
    }
};

/**
 * Updates the dark mode setting for the user
 * @param {*} dark_mode_setting New setting value (true/false)
 * @param {*} jwt_token  JWT Token of the user
 * @returns 
 */
export const updateDarkModeSetting = async (dark_mode_setting, jwt_token) => {
    try {
        const res = await fetch(`/api/settings/dark_mode/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dark_mode_setting, jwt_token }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error updating dark mode setting:', errorData.error || 'Unknown error');
            return false;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error updating dark mode setting:', error);
        return false;
    }
};