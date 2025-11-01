// app/_layout.tsx

import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  // Obtenemos el nuevo estado de carga de la sesión
  const { isAuthenticated, authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Condición de salida súper robusta:
    // No hacemos NADA hasta que la sesión de auth esté verificada Y las fuentes estén cargadas.
    const isReady = (fontsLoaded || fontError) && !authLoading;
    if (!isReady) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // Esta lógica ahora solo se ejecuta cuando estamos 100% seguros del estado de la app.
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, authLoading, fontsLoaded, fontError, segments]); // Añadimos authLoading a las dependencias

  // Ocultamos el Splash Screen solo cuando todo esté listo
  useEffect(() => {
    const isReady = (fontsLoaded || fontError) && !authLoading;
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authLoading]);

  // Si no estamos listos, no renderizamos nada para evitar errores.
  const isReady = (fontsLoaded || fontError) && !authLoading;
  if (!isReady) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ presentation: 'modal', title: 'Finalizar Compra' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootLayoutNav />
      </CartProvider>
    </AuthProvider>
  );
}