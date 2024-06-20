import { logErrorInDev, logInTest } from '@utils/log-utils';
import axios, { AxiosError } from 'axios';
import ENDPOINTS from '@constants/apiEndpoints';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchRandomCode = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${ENDPOINTS.RANDOM_CODE}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      // An unexpected error that isn't handled by Axios (e.g., a coding error before the request)
      logErrorInDev('Unexpected error', error);
      toast.error('Unexpected error occurred');
      throw new Error('Unexpected error occurred');
    }
  }
};

export const fetchClientId = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      // An unexpected error that isn't handled by Axios (e.g., a coding error before the request)
      logErrorInDev('Unexpected error', error);
      logInTest('Error: error is not an instance of AxiosError');
      toast.error('Unexpected error occurred');
      throw new Error('Unexpected error occurred');
    }
  }
};
