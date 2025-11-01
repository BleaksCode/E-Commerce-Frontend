// src/services/categoryService.ts
import apiClient from '../api/client';
import { Category } from '../types/api';

class CategoryService {
  /**
   * Obtiene la lista completa de categorías.
   * Endpoint: GET /categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/categories');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener las categorías:', error.response?.data || error.message);
      return [];
    }
  }
}

export default new CategoryService();