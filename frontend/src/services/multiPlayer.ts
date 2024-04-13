import { logErrorInDev } from '@utils/log-utils';
import axios from 'axios';
import ENDPOINTS from '@constants/apiEndpoints';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// eslint-disable-next-line consistent-return
const fetchRandomCode = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${ENDPOINTS.RANDOM_CODE}`
    );
    return response.data;
  } catch (error) {
    logErrorInDev('Error generating code:', error);
  }
};

export default fetchRandomCode;
