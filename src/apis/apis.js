import axios from "axios";

const API_BASE_URL = 'http://localhost:55555';

export const getCampaignList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_all_campaigns/`);
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error fetching campaigns list:', error);
    }
  };

  export const getEmailTemplatesList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_email_templates/`);
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error email templates:', error);
    }
  };

  export const getOpenedMails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list-emails/?is_opened=True`);
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error email templates:', error);
    }
  };