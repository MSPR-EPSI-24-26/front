import { productsApi } from '@/lib/api';
import { ENDPOINTS } from '@/config/api';
import { Product } from '@/types';

export interface CreateProductData {
  label: string;
  description?: string;
  price: number;
  stock: number;
}

export interface UpdateProductData {
  label?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await productsApi.get(ENDPOINTS.PRODUCTS.BASE);
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await productsApi.get(ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  async getByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    const response = await productsApi.get(ENDPOINTS.PRODUCTS.BY_PRICE_RANGE(minPrice, maxPrice));
    return response.data;
  },

  async create(data: CreateProductData): Promise<Product> {
    const response = await productsApi.post(ENDPOINTS.PRODUCTS.BASE, data);
    return response.data;
  },

  async update(id: number, data: UpdateProductData): Promise<Product> {
    const response = await productsApi.patch(ENDPOINTS.PRODUCTS.BY_ID(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await productsApi.delete(ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  async getStock(id: number): Promise<{ stock: number }> {
    const response = await productsApi.get(ENDPOINTS.PRODUCTS.STOCK(id));
    return response.data;
  },

  async updateStock(id: number, stock: number): Promise<{ stock: number }> {
    const response = await productsApi.patch(ENDPOINTS.PRODUCTS.STOCK(id), { stock });
    return response.data;
  },

  async seedProducts(): Promise<{ message: string; count: number }> {
    const response = await productsApi.post(ENDPOINTS.PRODUCTS.SEED);
    return response.data;
  },
};