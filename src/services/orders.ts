import { ordersApi } from '@/lib/api';
import { ENDPOINTS } from '@/config/api';
import { Order, OrderItem } from '@/types';

export interface CreateOrderData {
  customerId?: number; // Optional, will be set from auth context
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
}

export interface UpdateOrderData {
  status?: Order['status'];
  notes?: string;
  shippingAddress?: string;
  billingAddress?: string;
}

export const orderService = {
  async getAll(customerId?: number): Promise<Order[]> {
    let url = ENDPOINTS.ORDERS.BASE;
    if (customerId) {
      url += `?customerId=${customerId}`;
    }
    const response = await ordersApi.get(url);
    return response.data;
  },

  async getById(id: number): Promise<Order> {
    const response = await ordersApi.get(ENDPOINTS.ORDERS.BY_ID(id));
    return response.data;
  },

  async getByCustomer(customerId: number): Promise<Order[]> {
    const response = await ordersApi.get(ENDPOINTS.ORDERS.BY_CUSTOMER(customerId));
    return response.data;
  },

  async getByStatus(status: string): Promise<Order[]> {
    const response = await ordersApi.get(ENDPOINTS.ORDERS.BY_STATUS(status));
    return response.data;
  },

  async create(data: CreateOrderData): Promise<Order> {
    const response = await ordersApi.post(ENDPOINTS.ORDERS.BASE, data);
    return response.data;
  },

  async update(id: number, data: UpdateOrderData): Promise<Order> {
    const response = await ordersApi.patch(ENDPOINTS.ORDERS.BY_ID(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await ordersApi.delete(ENDPOINTS.ORDERS.BY_ID(id));
  },

  async getTotal(id: number): Promise<{ total: number }> {
    const response = await ordersApi.get(ENDPOINTS.ORDERS.TOTAL(id));
    return response.data;
  },

  async confirm(id: number): Promise<Order> {
    const response = await ordersApi.patch(ENDPOINTS.ORDERS.CONFIRM(id));
    return response.data;
  },

  async cancel(id: number): Promise<Order> {
    const response = await ordersApi.patch(ENDPOINTS.ORDERS.CANCEL(id));
    return response.data;
  },
};