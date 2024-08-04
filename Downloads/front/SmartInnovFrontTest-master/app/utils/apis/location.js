import axios from 'axios';

const API_URL = 'http://localhost:4002/countries';

export const fetchCountries = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const getCountryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching country with id ${id}:`, error);
    throw error;
  }
};

export const fetchStates = async () => {
  try {
    const response = await axios.get('http://localhost:4002/states');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
};

export const fetchCities = async () => {
  try {
    const response = await axios.get('http://localhost:4002/cities');
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};
