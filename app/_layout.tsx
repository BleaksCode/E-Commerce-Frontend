// app/_layout.tsx

import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // La condición de salida sigue siendo la misma:
    // No hacemos nada hasta que la sesión de auth esté verificada Y las fuentes estén cargadas.
    const isReady = (fontsLoaded || fontError) && !authLoading;
    if (!isReady) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
    // Hemos ELIMINADO la lógica que te forzaba a ir al login.
    // Ahora, solo nos preocupamos de una cosa:
    // Si el usuario SÍ está autenticado Y ADEMÁS está en el grupo de login
    // (por ejemplo, si acaba de iniciar sesión), lo llevamos a la página principal.
    if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
    
    // Si no está autenticado, no hacemos nada, simplemente se queda donde está (en la Homepage).

  }, [isAuthenticated, authLoading, fontsLoaded, fontError, segments]);

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