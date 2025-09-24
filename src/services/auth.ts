import { customerApi } from '@/lib/api';
import { ENDPOINTS } from '@/config/api';
import { User, Customer, AuthResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await customerApi.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await customerApi.post(ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await customerApi.get(ENDPOINTS.AUTH.PROFILE);
    return response.data.user;
  },

  async validateToken(): Promise<{ valid: boolean; user?: User }> {
    const response = await customerApi.post(ENDPOINTS.AUTH.VALIDATE);
    return response.data;
  },
};

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const response = await customerApi.get(ENDPOINTS.CUSTOMERS.BASE);
    return response.data;
  },

  async getById(id: number): Promise<Customer> {
    const response = await customerApi.get(ENDPOINTS.CUSTOMERS.BY_ID(id));
    return response.data;
  },

  async getMe(): Promise<Customer> {
    const response = await customerApi.get(ENDPOINTS.CUSTOMERS.ME);
    return response.data;
  },

  async updateMe(data: Partial<Customer>): Promise<Customer> {
    const response = await customerApi.patch(ENDPOINTS.CUSTOMERS.ME, data);
    return response.data;
  },

  async create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const response = await customerApi.post(ENDPOINTS.CUSTOMERS.BASE, data);
    return response.data;
  },

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    const response = await customerApi.patch(ENDPOINTS.CUSTOMERS.BY_ID(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await customerApi.delete(ENDPOINTS.CUSTOMERS.BY_ID(id));
  },
};