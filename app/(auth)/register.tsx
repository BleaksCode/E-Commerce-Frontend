// app/(auth)/register.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import authService from '../../src/services/authService';
import { CreateUserPayload } from '../../src/types/api';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/[0-9]/.test(pass)) {
      return 'La contraseña debe contener al menos un número';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      return 'La contraseña debe contener al menos un carácter especial';
    }
    return null;
  };

  const handleRegister = async () => {
    // Validaciones
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Contraseña inválida', passwordError);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const userData: CreateUserPayload = {
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
      };

      await authService.register(userData);
      
      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        [
          {
            text: 'Ir a login',
            onPress: () => router.push('/(auth)/login')
          }
        ]
      );
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.response?.status === 409) {
        Alert.alert('Error', 'Este email ya está registrado.');
      } else if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else if (error.message.includes('Network Error')) {
        Alert.alert('Error de conexión', 'No se pudo conectar al servidor. Verifica tu conexión a internet.');
      } else {
        Alert.alert('Error', 'No se pudo completar el registro. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Nombre *" 
          onChangeText={setFirstName} 
          value={firstName}
          editable={!isLoading}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Apellido *" 
          onChangeText={setLastName} 
          value={lastName}
          editable={!isLoading}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Email *" 
          onChangeText={setEmail} 
          value={email} 
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Teléfono (opcional)" 
          onChangeText={setPhone} 
          value={phone}
          keyboardType="phone-pad"
          editable={!isLoading}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña *" 
          onChangeText={setPassword} 
          value={password} 
          secureTextEntry
          editable={!isLoading}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Confirmar contraseña *" 
          onChangeText={setConfirmPassword} 
          value={confirmPassword} 
          secureTextEntry
          editable={!isLoading}
        />
        
        <Text style={styles.hint}>
          * La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, números y caracteres especiales
        </Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <Button title="Registrarse" onPress={handleRegister} />
        )}
        
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/login')}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
  hint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10
  },
  linkText: { 
    color: '#007AFF', 
    textAlign: 'center', 
    marginTop: 15,
    fontSize: 16
  },
  loader: {
    marginVertical: 20
  }
});

export default RegisterScreen;