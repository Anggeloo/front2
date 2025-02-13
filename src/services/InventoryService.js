import axios from 'axios';
import { urlInventory } from '../config/Urls';

const API_SEARCH_URL = urlInventory.search;
const API_ADD_URL = urlInventory.create;
const API_UPDATE_URL = urlInventory.update;
const API_DELETE_URL = urlInventory.delete;

const InventoryService = {

  getAll: async () => {
    try {
      const response = await axios.get(API_SEARCH_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventories:', error);
      throw error;
    }
  },

  getByCode: async (codice) => {
    try {
      const response = await axios.get(`${API_SEARCH_URL}/searchInventoryByCodice/search?codice=${codice}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory with CODICE ${codice}:`, error);
      throw error;
    }
  },

  add: async (data) => {
    try {
      const response = await axios.post(`${API_ADD_URL}/add`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating inventory:', error);
      throw error;
    }
  },

  update: async (data) => {
    try {
      const response = await axios.put(`${API_UPDATE_URL}/update`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating inventory`, error);
      throw error;
    }
  },

  delete: async (codice) => {
    try {
      await axios.delete(`${API_DELETE_URL}/delete/${codice}`);
    } catch (error) {
      console.error(`Error deleting inventory with codice ${codice}:`, error);
      throw error;
    }
  },
};

export default InventoryService;
