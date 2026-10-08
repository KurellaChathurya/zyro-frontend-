import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/items';

export const getAllItems = () => {
  return axios.get(API_BASE_URL);
};

export const createItem = (itemData) => {
  return axios.post(API_BASE_URL, itemData);
};