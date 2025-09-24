/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Use proxy in development to avoid CORS issues
const isDev = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  CUSTOMER: isDev 
    ? '/api/customers'
    : process.env.NEXT_PUBLIC_API_CUSTOMER_URL || 'https://customers.payetonkawa.shop',
  ORDERS: isDev
    ? '/api/orders'
    : process.env.NEXT_PUBLIC_API_ORDERS_URL || 'https://orders.payetonkawa.shop',
  PRODUCTS: isDev
    ? '/api/products'
    : process.env.NEXT_PUBLIC_API_PRODUCTS_URL || 'https://products.payetonkawa.shop',
  MESSAGE_BROKER: process.env.NEXT_PUBLIC_API_MESSAGE_BROKER_URL || 'https://message-broker.payetonkawa.shop',
} as const;

export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'PayeTonKawa Shop',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
} as const;

// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints (Customer API)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    VALIDATE: '/auth/validate',
  },
  
  // Customer endpoints
  CUSTOMERS: {
    BASE: '/customers',
    ME: '/customers/me',
    BY_ID: (id: number) => `/customers/${id}`,
  },
  
  // Product endpoints
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: number) => `/products/${id}`,
    BY_PRICE_RANGE: (minPrice: number, maxPrice: number) => 
      `/products?minPrice=${minPrice}&maxPrice=${maxPrice}`,
    STOCK: (id: number) => `/products/${id}/stock`,
    SEED: '/products/seed',
  },
  
  // Order endpoints
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: number) => `/orders/${id}`,
    BY_CUSTOMER: (customerId: number) => `/orders/customer/${customerId}`,
    BY_STATUS: (status: string) => `/orders/status/${status}`,
    TOTAL: (id: number) => `/orders/${id}/total`,
    CONFIRM: (id: number) => `/orders/${id}/confirm`,
    CANCEL: (id: number) => `/orders/${id}/cancel`,
  },
} as const;

export default API_CONFIG;