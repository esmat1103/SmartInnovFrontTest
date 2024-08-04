import axios from 'axios';

const API_URL = 'http://localhost:3004/units';

export const fetchUnits = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
};

export const createUnit = async (unit) => {
  try {
    const response = await axios.post(API_URL, unit);
    return response.data;
  } catch (error) {
    console.error('Error creating unit:', error);
    throw error;
  }
};

export const getUnitById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unit by ID:', error);
    throw error;
  }
};

export const updateUnitById = async (id, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates); 
    return response.data;
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
};

export const deleteUnitById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};
