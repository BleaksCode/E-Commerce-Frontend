// app/(tabs)/profile.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
// CORRECCIÓN: Importa desde el archivo de AuthContext, no desde el layout
import { useAuth } from '../../src/context/AuthContext';
import authService from '../../src/services/authService';

// Convertido a React.FC para consistencia
const ProfileScreen: React.FC = () => {
  // CORRECCIÓN: Cambia 'user' por 'userProfile'
  const { isAuthenticated, userProfile, signOut } = useAuth();
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
            // Llama primero al servicio de logout (que limpia el token)
            await authService.logout();
            // Llama a signOut del contexto (que limpia el estado de React)
            signOut();
            Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente');
            // El _layout se encargará de redirigir al login
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
          {/* CORRECCIÓN: Usa userProfile.email */}
          <Text style={styles.infoValue}>{userProfile?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID Usuario:</Text>
          {/* CORRECCIÓN: Usa userProfile.sub */}
          <Text style={styles.infoValue}>{userProfile?.sub}</Text>
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

export default ProfileScreen;