import axios from 'axios';

const API_URL = 'http://localhost:3001/sensorTypes';

// Fetch all sensor types
export const fetchSensorTypes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to fetch sensor types');
  }
};

// Create a new sensor type
export const createSensorType = async (sensorType) => {
  try {
    const response = await axios.post(API_URL, sensorType);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to create sensor type');
  }
};

// Get a sensor type by ID
export const getSensorTypeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to fetch sensor type');
  }
};

// Update a sensor type by ID
export const updateSensorTypeById = async (id, updates) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to update sensor type');
  }
};

// Delete a sensor type by ID
export const deleteSensorTypeById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to delete sensor type');
  }
};
