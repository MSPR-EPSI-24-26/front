import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/api';

// Create axios instances for each service
export const customerApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.CUSTOMER,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.PRODUCTS,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ordersApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.ORDERS,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const messageBrokerApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.MESSAGE_BROKER,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  
  // Update all axios instances with the new token
  const apis = [customerApi, productsApi, ordersApi, messageBrokerApi];
  
  apis.forEach(api => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  });
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setAuthToken(token);
      return token;
    }
  }
  
  return null;
};

// Initialize token from localStorage on app start
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  if (token) {
    setAuthToken(token);
  }
}

// Request interceptor to add auth token
const addAuthInterceptor = (api: AxiosInstance) => {
  api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        origin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
      });
    }
    
    return config;
  });
};

// Response interceptor for error handling
const addErrorInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      // Log CORS errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', {
          message: error.message,
          status: error.response?.status,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          }
        });
      }
      
      if (error.response?.status === 401) {
        // Token expired or invalid
        setAuthToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to all APIs
[customerApi, productsApi, ordersApi, messageBrokerApi].forEach(api => {
  addAuthInterceptor(api);
  addErrorInterceptor(api);
});

export default {
  customerApi,
  productsApi,
  ordersApi,
  messageBrokerApi,
  setAuthToken,
  getAuthToken,
};