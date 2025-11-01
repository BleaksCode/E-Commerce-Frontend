// src/utils/authHelper.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/api'; // Importamos el tipo para los datos del usuario

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

/**
 * Guarda el token JWT en el almacenamiento local.
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error al guardar el token:', error);
  }
};

/**
 * Obtiene el token JWT del almacenamiento local.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

/**
 * Guarda los datos del perfil del usuario en el almacenamiento local.
 */
export const saveUser = async (user: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
  }
};

/**
 * Obtiene los datos del perfil del usuario del almacenamiento local.
 */
export const getUser = async (): Promise<UserProfile | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) as UserProfile : null;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return null;
  }
};

/**
 * Limpia toda la información de autenticación (token y usuario).
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error al limpiar los datos de autenticación:', error);
  }
};