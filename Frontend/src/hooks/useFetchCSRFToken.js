import { useEffect } from 'react';
import axios from 'axios';

const useFetchCSRFToken = () => {
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await axios.get('/sanctum/csrf-cookie');
        console.log('CSRF Token fetched successfully:', response);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCSRFToken();
  }, []);
};

export default useFetchCSRFToken;
