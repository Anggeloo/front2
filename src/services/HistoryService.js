import axios from 'axios';
import { urlHistory } from '../config/Urls';

const API_URL = urlHistory;

const HistoryService = {
  getAll: async () => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          query {
            getHistory {
              status
              data {
                history_id
                user_code
                history_action
                created_at
                updated_at
              }
              message
            }
          }
        `
      });

      return response.data.data.getHistory;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },

  add: async (action) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(API_URL, {
        query: `
          mutation {
            addHistory(user_code: "${user?.userCode}", history_action: "${action}") {
              status
              data {
                history_id
                user_code
                history_action
                created_at
                updated_at
              }
              message
            }
          }
        `
      });

      return response.data.data.addHistory;
    } catch (error) {
      console.error('Error creating history:', error);
      throw error;
    }
  }
};

export default HistoryService;
