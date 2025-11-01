// app/checkout.tsx
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Añadido TouchableOpacity
import LoadingSpinner from '../src/components/LoadingSpinner';
import { useAuth } from '../src/context/AuthContext';
import { useCart } from '../src/context/CartContext';
import addressService from '../src/services/addressService'; // <-- CORREGIDO: 'addressService' en lugar de 'adressService'
import orderService from '../src/services/orderService';
import { Address } from '../src/types/api';

const CheckoutScreen: React.FC = () => {
  const router = useRouter();
  const { items, clearCart, itemCount } = useCart(); // Añadido itemCount para el total
  const { userProfile } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true);
      const userAddresses = await addressService.getMyAddresses();
      setAddresses(userAddresses);
      const defaultAddress = userAddresses.find(a => a.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
      setIsLoading(false);
    };
    loadAddresses();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const totalAmount = subtotal;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      Alert.alert('Error', 'Por favor, selecciona una dirección de envío.');
      return;
    }
    if (!userProfile) {
      Alert.alert('Error', 'No se pudo verificar el usuario.');
      return;
    }

    setIsLoading(true);
    try {
      await orderService.createOrder({
        user_id: userProfile.sub,
        total_amount: totalAmount,
        subtotal: subtotal,
        shipping_address_id: selectedAddressId,
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product?.name || 'Producto',
          product_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.unit_price * item.quantity,
        })),
      });
      
      Alert.alert('¡Pedido Realizado!', 'Tu pedido ha sido procesado exitosamente.');
      clearCart();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al procesar tu pedido.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Stack.Screen options={{ title: 'Finalizar Compra' }} />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
        {items.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemName}>{item.product?.name || `ID: ${item.product_id}`} (x{item.quantity})</Text>
            <Text>${(item.unit_price * item.quantity / 100).toFixed(2)}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Dirección de Envío</Text>
        {addresses.length > 0 ? (
          addresses.map(addr => (
            <TouchableOpacity key={addr.id} onPress={() => setSelectedAddressId(addr.id)} style={[styles.addressBox, selectedAddressId === addr.id && styles.selected]}>
              <Text style={styles.addressText}>{addr.address_line1}, {addr.city}</Text>
              <Text style={styles.addressText}>{addr.state}, {addr.postal_code}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No tienes direcciones guardadas. Añade una desde tu perfil.</Text>
        )}


        <View style={styles.summary}>
          <Text style={styles.summaryLine}>Subtotal: <Text>${(subtotal / 100).toFixed(2)}</Text></Text>
          <Text style={styles.summaryLine}>Envío: <Text>Gratis</Text></Text>
          <Text style={styles.total}>Total: <Text>${(totalAmount / 100).toFixed(2)}</Text></Text>
        </View>

        <Button title={isLoading ? 'Procesando...' : 'Confirmar y Pagar'} onPress={handlePlaceOrder} disabled={isLoading || itemCount === 0} />
      </ScrollView>
    </>
  );
};

// Estilos mejorados
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#333' },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingVertical: 5 },
  itemName: { flex: 1 },
  summary: { marginTop: 20, marginBottom: 20, paddingTop: 15, borderTopWidth: 1, borderColor: '#eee' },
  summaryLine: { fontSize: 16, color: '#555', marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  addressBox: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 },
  addressText: { fontSize: 16 },
  selected: { borderColor: '#007bff', borderWidth: 2, backgroundColor: '#eef8ff' }
});

export default CheckoutScreen;