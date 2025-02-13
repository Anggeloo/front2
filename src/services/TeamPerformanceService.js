import axios from 'axios';
import { urlTeamPerformance } from '../config/Urls';

const API_URL =urlTeamPerformance;

const TeamPerformanceService = {

  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  },

  getByCode: async (codice) => {
    try {
      const response = await axios.get(`${API_URL}/${codice}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching with CODICE ${codice}:`, error);
      throw error;
    }
  },

  add: async (product) => {
    try {
      const response = await axios.post(`${API_URL}/add`, product);
      return response.data;
    } catch (error) {
      console.error('Error creating:', error);
      throw error;
    }
  },

  update: async (codice, product) => {
    try {
      const response = await axios.put(`${API_URL}/update/${codice}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating with codice ${codice}:`, error);
      throw error;
    }
  },

  delete: async (codice) => {
    try {
      await axios.delete(`${API_URL}/delete/${codice}`);
    } catch (error) {
      console.error(`Error deleting with codice ${codice}:`, error);
      throw error;
    }
  },
};

export default TeamPerformanceService;
