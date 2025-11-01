// src/services/authService.ts
import apiClient from '../api/client';
import { CreateUserPayload, User, UserProfile } from '../types/api';
import { clearAuthData, getUser, saveToken, saveUser } from '../utils/authHelper';

class AuthService {
  /**
   * Inicia sesión con email y contraseña.
   * La lógica está adaptada para el MOCK server.
   */
  async login(email: string, password: string): Promise<UserProfile> {
    try {
      // --- LÓGICA MOCK (para usar con json-server) ---
      const response = await apiClient.get<User[]>(`/users?email=${email}`);
      
      if (response.data.length > 0) {
        const user = response.data[0];
        const fakeToken = 'fake-jwt-token-for-development';
        
        // El perfil de usuario que guardaremos será una versión simplificada del objeto User
        const userProfile: UserProfile = { sub: user.id, email: user.email };
        
        await saveToken(fakeToken);
        await saveUser(userProfile);
        
        return userProfile;
      } else {
        throw new Error('Credenciales inválidas');
      }
      // --- FIN DE LÓGICA MOCK ---

      /* --- LÓGICA REAL (cuando el backend de NestJS esté listo) ---
      const payload: LoginPayload = { email, password };
      const response = await apiClient.post<LoginResponse>('/auth/login', payload);
      
      if (response.data.access_token) {
        await saveToken(response.data.access_token);
        const profile = await this.getProfile(); // Llama al endpoint real /auth/profile
        await saveUser(profile);
        return profile;
      } else {
        throw new Error('No se recibió el token de acceso');
      }
      */
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado.
   * La lógica está adaptada para el MOCK server (lee desde el storage local).
   */
  async getProfile(): Promise<UserProfile | null> {
    // --- LÓGICA MOCK ---
    return await getUser();
    // --- FIN DE LÓGICA MOCK ---

    /* --- LÓGICA REAL ---
    try {
      const response = await apiClient.get<UserProfile>('/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error.response?.data || error.message);
      throw error;
    }
    */
  }

  /**
   * Registra un nuevo usuario. El endpoint es el mismo para el mock y el real.
   */
  async register(userData: CreateUserPayload): Promise<User> {
    try {
      const response = await apiClient.post<User>('/users', userData);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario (limpia los datos locales).
   */
  async logout(): Promise<void> {
    await clearAuthData();
  }
}

export default new AuthService();