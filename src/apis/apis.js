import axios from "axios";
import { API_URL } from "../config/defaults";

const API_BASE_URL = API_URL;

export const getMailbox = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mail`, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching Mailbox", error);
  }
};

export const getInbox = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inbox`, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching Inbox", error);
  }
};

export const getDraft = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/draft`, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching draft", error);
  }
};

export const getNextMessages = async (dataLink) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fetchMore`, {dataLink: String(dataLink)},{
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching Inbox", error);
  }
};


/**************************************** */
export const validateUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/validate`, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error validating user", error);
  }
};

export const addAssociateAccount = async (associated_user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/associate-account`, { associated_user: associated_user}, {
      withCredentials: true,
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error adding user account", error);
  }
};

export const getCampaignList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_all_campaigns/`, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaigns list:", error);
  }
};

export const getEmailTemplatesList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_email_templates/`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error email templates:", error);
  }
};

export const getOpenedMails = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/list-emails/?is_opened=True`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error email templates:", error);
  }
};

export const getCompanyDetails = async (company_domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getComapany?company_domain=${company_domain}`, {
      withCredentials: true,
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching company details", error);
    return 500
  }
};