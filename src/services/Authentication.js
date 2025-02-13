import axios from 'axios';
import { urlAuthentication } from '../config/Urls';

const API_URL = urlAuthentication;

const AuthenticationService = {
  login: async (user) => {
    try {
      const response = await axios.post(`${API_URL}/login`, user);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
};

export default AuthenticationService;
