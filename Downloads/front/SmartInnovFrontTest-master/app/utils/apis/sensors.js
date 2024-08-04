import axios from 'axios';

const API_URL = 'http://localhost:3001/sensors';

export const fetchSensors = async () => {
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
    throw new Error('Failed to fetch sensors');
  }
};

export const fetchSensorsByDevice = async (deviceId) => {
  try {
    const response = await axios.get(`${API_URL}/device`, { params: { deviceId } });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to fetch sensors for the device');
  }
};

export const createSensor = async (sensor) => {
  const response = await axios.post(API_URL, sensor);
  return response.data;
};

export const getSensorById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateSensorById = async (id, updates) => {
  const response = await axios.patch(`${API_URL}/${id}`, updates);
  return response.data;
};

export const deleteSensorById = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
