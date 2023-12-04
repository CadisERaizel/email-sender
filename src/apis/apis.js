import axios from "axios";
import { API_URL } from "../config/defaults";

const API_BASE_URL = API_URL

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