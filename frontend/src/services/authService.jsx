import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/auth`;

export const registerUser = async (formData) => {
  const res = await axios.post(`${API_URL}/register`, formData);
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await axios.post(`${API_URL}/login`, formData);
  return res.data;
};
