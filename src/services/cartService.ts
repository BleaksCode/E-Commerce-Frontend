// src/services/cartService.ts
import apiClient from '../api/client';
import { AddToCartPayload, CartItem, ShoppingCart } from '../types/api';

class CartService {
  /**
   * Obtiene o crea el carrito para el usuario autenticado.
   * El backend debería manejar la lógica de "encontrar o crear".
   * Endpoint: GET /shopping-cart (asumimos que filtrará por usuario)
   */
  async getMyCart(): Promise<ShoppingCart | null> {
    try {
      // Esta es una suposición, el backend podría tener un endpoint como /shopping-cart/my
      const response = await apiClient.get<ShoppingCart[]>('/shopping-cart');
      // Asumimos que devuelve un array y tomamos el primer carrito del usuario
      return response.data[0] || null;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      return null;
    }
  }

  /**
   * Añade un nuevo artículo al carrito.
   * Endpoint: POST /cart-items
   */
  async addItemToCart(payload: AddToCartPayload): Promise<CartItem> {
    try {
      const response = await apiClient.post<CartItem>('/cart-items', payload);
      return response.data;
    } catch (error) {
      console.error('Error al añadir el artículo:', error);
      throw error;
    }
  }

  /**
   * Actualiza la cantidad de un artículo en el carrito.
   * Endpoint: PATCH /cart-items/:id
   */
  async updateItemQuantity(itemId: number, quantity: number): Promise<CartItem> {
    try {
      const response = await apiClient.patch<CartItem>(`/cart-items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
      throw error;
    }
  }

  /**
   * Elimina un artículo del carrito.
   * Endpoint: DELETE /cart-items/:id
   */
  async removeItemFromCart(itemId: number): Promise<void> {
    try {
      await apiClient.delete(`/cart-items/${itemId}`);
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
      throw error;
    }
  }
}

export default new CartService();