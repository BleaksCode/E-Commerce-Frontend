// app/(auth)/login.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import authService from '../../src/services/authService';
import { useAuth } from '../_layout';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu email y contraseña.');
      return;
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido.');
      return;
    }

    // Validación de longitud mínima de contraseña
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Llamar al servicio de autenticación
      await authService.login(email, password);
      
      // Obtener el perfil del usuario
      const profile = await authService.getProfile();
      const userProfile = await authService.login(email, password);

      Alert.alert('Éxito', 'Has iniciado sesión correctamente.');
      signIn(userProfile); // <-- PASAMOS EL PERFIL AL CONTEXTO   
      
      Alert.alert('¡Bienvenido!', `Inicio de sesión exitoso`);
      
      // Volver a la pantalla anterior
      router.back();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        Alert.alert('Error', 'Email o contraseña incorrectos.');
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        Alert.alert('Error', 'Tiempo de espera agotado. Verifica tu conexión.');
      } else if (error.message.includes('Network Error')) {
        Alert.alert('Error de conexión', 'No se pudo conectar al servidor. Verifica tu conexión a internet.');
      } else {
        Alert.alert('Error', 'No se pudo iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña (mín. 8 caracteres)" 
        onChangeText={setPassword} 
        value={password} 
        secureTextEntry
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <Button title="Iniciar Sesión" onPress={handleLogin} />
      )}
      
      <TouchableOpacity 
        onPress={() => router.push('/(auth)/register')}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
        disabled={isLoading}
      >
        <Text style={styles.backText}>Volver sin iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  input: { 
    height: 50, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginBottom: 15, 
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16
  },
  linkText: { 
    color: '#007AFF', 
    textAlign: 'center', 
    marginTop: 15,
    fontSize: 16
  },
  backButton: {
    marginTop: 20
  },
  backText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14
  },
  loader: {
    marginVertical: 20
  }
});

export default LoginScreen;