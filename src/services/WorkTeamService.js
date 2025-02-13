import axios from 'axios';
import { urlWorkTeam } from '../config/Urls';

const API_SEARCH_URL = urlWorkTeam.search;
const API_ADD_URL = urlWorkTeam.create;
const API_UPDATE_URL = urlWorkTeam.update;
const API_DELETE_URL = urlWorkTeam.delete;

const WorkTeamService = {

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
            await axios.delete(`${API_DELETE_URL}/delete/${codice}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {} 
            });
        } catch (error) {
            console.error(`Error deleting work team with codice ${codice}:`, error);
            throw error;
        }
    },
    
};

export default WorkTeamService;
