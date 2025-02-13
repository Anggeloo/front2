import axios from 'axios';
import { urlProduct } from '../config/Urls';

const API_SEARCH_URL = urlProduct.search;
const API_ADD_URL = urlProduct.create;
const API_UPDATE_URL = urlProduct.update;
const API_DELETE_URL = urlProduct.delete;

const ProductService = {

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
      const response = await axios.get(`${API_SEARCH_URL}/byCodiceProducto?codice=${codice}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with CODICE ${codice}:`, error);
      throw error;
    }
  },

  add: async (product) => {
    try {
      const response = await axios.post(`${API_ADD_URL}/add`, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  update: async (codice, product) => {
    try {
      const response = await axios.put(`${API_UPDATE_URL}/update/${codice}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with codice ${codice}:`, error);
      throw error;
    }
  },

  delete: async (codice) => {
    try {
      await axios.delete(`${API_DELETE_URL}/delete/${codice}`);
    } catch (error) {
      console.error(`Error deleting product with codice ${codice}:`, error);
      throw error;
    }
  },
};

export default ProductService;
