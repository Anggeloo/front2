import axios from 'axios';
import { urlOrder } from '../config/Urls';

const API_SEARCH_URL = urlOrder.search;
const API_ADD_URL = urlOrder.create;
const API_UPDATE_URL = urlOrder.update;
const API_DELETE_URL = urlOrder.delete;

const OrderService = {

  getAll: async () => {
    try {
      const response = await axios.get(API_SEARCH_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getByCode: async (codice) => {
    try {
      const response = await axios.get(`${API_SEARCH_URL}/${codice}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with CODICE ${codice}:`, error);
      throw error;
    }
  },

  add: async (data) => {
    try {
      const response = await axios.post(`${API_ADD_URL}/add`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  update: async (codice, data) => {
    try {
      const response = await axios.put(`${API_UPDATE_URL}/update/${codice}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating order with codice ${codice}:`, error);
      throw error;
    }
  },

  delete: async (codice) => {
    try {
      await axios.delete(`${API_DELETE_URL}/delete/${codice}`);
    } catch (error) {
      console.error(`Error deleting order with codice ${codice}:`, error);
      throw error;
    }
  },
};

export default OrderService;
