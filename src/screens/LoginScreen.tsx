// src/screens/LoginScreen.tsx

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../app/_layout'; // Asumiendo que tu AuthContext está en el layout principal
import authService from '../services/authService'; // ¡Importamos el servicio!

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { signIn } = useAuth(); // Obtenemos la función para actualizar el estado global

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu email y contraseña.');
      return;
    }
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      // 1. La pantalla solo llama al servicio de login
      await authService.login(email, password);
      
      // 2. Si el login es exitoso, el servicio ya guardó el token y el usuario.
      //    Ahora solo actualizamos el estado de la UI.
      Alert.alert('Éxito', 'Has iniciado sesión correctamente.');
      signIn(user); // Esto cambiará el estado y el RootLayout nos redirigirá a las pestañas
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email o contraseña incorrectos.';
      Alert.alert('Error de autenticación', errorMessage);
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
            keyboardType="email-address" 
            autoCapitalize="none"
        />
        <TextInput 
            style={styles.input}
            placeholder="Contraseña" 
            onChangeText={setPassword} 
            value={password} 
            secureTextEntry 
        />
        <Button title={isLoading ? "Iniciando sesión..." : "Iniciar Sesión"} onPress={handleLogin} disabled={isLoading} />
        <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    linkText: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 15,
    },
});

export default LoginScreen;