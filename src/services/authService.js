import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080/api/auth';

export const register = (userData) => {
  return axios.post(`${AUTH_API_URL}/register`, userData);
};

export const login = (credentials) => {
  return axios.post(`${AUTH_API_URL}/login`, credentials);
};
