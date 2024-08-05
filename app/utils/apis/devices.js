import axios from 'axios';

const API_URL = 'http://localhost:4002/devices';

export const fetchDevices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDevice = async (device) => {
  const response = await axios.post(API_URL, device);
  return response.data;
};

export const getDeviceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateDeviceById = async (id, updates) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    console.log(`Update response for device ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating device ${id}:`, error);
    throw error;
  }
};

export const deleteDeviceById = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getDevicesByAdminId = async (adminID) => {
  const response = await axios.get(`${API_URL}/admin/${adminID}`);
  return response.data;
};


export const getDevicesByClientId = async (adminID) => {
  const response = await axios.get(`${API_URL}/client/${adminID}`);
  return response.data;
};


export const getDeviceByMacAddress = async (macAddress) => {
  const response = await axios.get(`${API_URL}/mac/${macAddress}`);
  return response.data;
};