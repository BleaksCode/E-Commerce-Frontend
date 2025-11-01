// src/screens/RegisterScreen.tsx

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import authService from '../services/authService'; // ¡Importamos nuestro nuevo servicio!
import { CreateUserPayload } from '../types/api';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }
    setIsLoading(true);
    try {
      const userData: CreateUserPayload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      };
      
      // La pantalla ya no sabe de Axios. Solo llama al servicio.
      const newUser = await authService.register(userData);
      
      Alert.alert('Éxito', `Usuario ${newUser.first_name} registrado correctamente. Ahora puedes iniciar sesión.`);
      router.push('/login'); // Navegamos de vuelta al login
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'No se pudo completar el registro.';
      Alert.alert('Error en el registro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <TextInput 
            style={styles.input}
            placeholder="Nombre" 
            onChangeText={setFirstName} 
            value={firstName} 
        />
        <TextInput 
            style={styles.input}
            placeholder="Apellido" 
            onChangeText={setLastName} 
            value={lastName} 
        />
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
        <Button title={isLoading ? "Registrando..." : "Registrarse"} onPress={handleRegister} disabled={isLoading} />
        <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
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

export default RegisterScreen;