// src/services/orderService.ts
import apiClient from '../api/client';
import { CreateOrderPayload, Order } from '../types/api';

class OrderService {
  /**
   * Crea un nuevo pedido.
   * Endpoint: POST /orders
   */
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    try {
      // El backend creará los order_items internamente a partir del payload
      const response = await apiClient.post<Order>('/orders', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear el pedido:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtiene el historial de pedidos del usuario autenticado.
   * Endpoint: GET /orders
   */
  async getMyOrders(): Promise<Order[]> {
    try {
      // El backend debería filtrar automáticamente por el usuario del token
      const response = await apiClient.get<Order[]>('/orders');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener los pedidos:', error.response?.data || error.message);
      return [];
    }
  }
}

export default new OrderService();