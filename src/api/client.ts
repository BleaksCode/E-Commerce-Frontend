// src/api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken, removeUser } from '../utils/authHelper';

// Configura la URL base según tu entorno
// Para desarrollo local con Expo:
// - iOS Simulator: http://localhost:3000
// - Android Emulator: http://10.0.2.2:3000
// - Dispositivo físico: http://TU_IP_LOCAL:3000
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Cambia al puerto de tu NestJS (generalmente 3000)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      await removeToken();
      await removeUser();
      
      // Aquí podrías emitir un evento para que la app redirija al login
      // O usar un state manager global para actualizar el estado de autenticación
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;