import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { debounce } from 'lodash';

const useApi = (getToken) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create API instance
  const api = axios.create({
    baseURL: config.API_BASE_URL || 'https://3.83.93.102.nip.io',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  const debouncedGet = useCallback(
    debounce((url, options) => makeRequest('get', url, null, options), 1000),
    [makeRequest]
  );

  // Add request interceptor for auth
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Wrapper for API calls with automatic loading and error handling
  const makeRequest = useCallback(async (method, url, data = null, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api({
        method,
        url,
        data,
        ...options
      });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Convenience methods
  const get = useCallback((url, options) => makeRequest('get', url, null, options), [makeRequest]);
  const post = useCallback((url, data, options) => makeRequest('post', url, data, options), [makeRequest]);
  const put = useCallback((url, data, options) => makeRequest('put', url, data, options), [makeRequest]);
  const del = useCallback((url, options) => makeRequest('delete', url, null, options), [makeRequest]);

  return {
    api,
    isLoading,
    error,
    get,
    post,
    put,
    delete: del
  };
};

export default useApi;