// src/services/productService.ts
import apiClient from '../api/client';
import { Product } from '../types/api';

class ProductService {
  /**
   * Obtiene la lista completa de productos.
   * Endpoint: GET /products
   */
  async getProducts(): Promise<Product[]> {
    try {
      // Usamos el endpoint real del backend
      const response = await apiClient.get<Product[]>('/products');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener los productos:', error.response?.data || error.message);
      return []; 
    }
  }

  /**
   * Obtiene los detalles de un único producto por su ID.
   * Endpoint: GET /products/:id
   */
  async getProductById(id: number): Promise<Product | null> {
    try {
      // Usamos el endpoint real para un producto específico
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener el producto ${id}:`, error.response?.data || error.message);
      return null;
    }
  }
}

export default new ProductService();