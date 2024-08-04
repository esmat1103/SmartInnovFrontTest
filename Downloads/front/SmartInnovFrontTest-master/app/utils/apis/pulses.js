import axios from 'axios';

const API_URL = 'http://localhost:3004/pulses';

export const fetchPulses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching pulses:', error);
    throw error;
  }
};

export const createPulse = async (pulse) => {
  try {
    const response = await axios.post(API_URL, pulse);
    return response.data;
  } catch (error) {
    console.error('Error creating pulse:', error);
    throw error;
  }
};

export const getPulseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pulse by ID:', error);
    throw error;
  }
};

export const updatePulseById = async (id, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates); // Use PUT for full updates or PATCH for partial updates
    return response.data;
  } catch (error) {
    console.error('Error updating pulse:', error);
    throw error;
  }
};

export const deletePulseById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting pulse:', error);
    throw error;
  }
};
