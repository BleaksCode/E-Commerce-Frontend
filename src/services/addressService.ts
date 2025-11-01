// src/services/addressService.ts
import apiClient from '../api/client';
import { Address, CreateAddressPayload } from '../types/api';

class AddressService {
  /**
   * Obtiene todas las direcciones del usuario autenticado.
   * Endpoint: GET /addresses
   */
  async getMyAddresses(): Promise<Address[]> {
    try {
      // El backend debería filtrar por el user_id del token JWT automáticamente
      const response = await apiClient.get<Address[]>('/addresses');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener las direcciones:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Crea una nueva dirección para el usuario autenticado.
   * Endpoint: POST /addresses
   */
  async createAddress(addressData: CreateAddressPayload): Promise<Address> {
    try {
      const response = await apiClient.post<Address>('/addresses', addressData);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear la dirección:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new AddressService();