import axios from 'axios';

const API_URL = 'http://localhost:3008/users';

export const getAllEndUsers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/role/enduser`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw error;
    }
};
