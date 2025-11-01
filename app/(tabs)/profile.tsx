// app/(tabs)/profile.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import authService from '../../src/services/authService';
import { useAuth } from '../_layout';

export default function ProfileScreen() {
  const { isAuthenticated, user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar sesión', 
          onPress: async () => {
            await authService.logout();
            signOut();
            Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente');
          }
        }
      ]
    );
  };

  // Usuario no autenticado - mostrar botón de login
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mi Perfil</Text>
        <Text style={styles.message}>Inicia sesión para ver tu perfil y gestionar tu cuenta</Text>
        <Button 
          title="Iniciar Sesión" 
          onPress={() => router.push('/(auth)/login')} 
        />
      </View>
    );
  }

  // Usuario autenticado - mostrar perfil
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.welcome}>¡Bienvenido de vuelta!</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID Usuario:</Text>
          <Text style={styles.infoValue}>{user?.sub}</Text>
        </View>
      </View>

      <Button 
        title="Cerrar Sesión" 
        onPress={handleLogout}
        color="#FF3B30" 
      />
    </View>
  );
}

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
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    paddingHorizontal: 20
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#007AFF'
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  infoValue: {
    fontSize: 16,
    color: '#666'
  }
});