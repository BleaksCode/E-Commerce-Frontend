// app/(auth)/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ocultamos el header en todas las pantallas de autenticación
        contentStyle: { backgroundColor: '#fff' }, // Fondo blanco consistente
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          title: 'Iniciar Sesión',
          // Si en algún momento quieres mostrar el header, estas opciones estarán listas
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{
          title: 'Crear Cuenta',
        }} 
      />
    </Stack>
  );
}