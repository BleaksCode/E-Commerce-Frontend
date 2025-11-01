// app/(tabs)/cart.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import { useCart } from '../../src/context/CartContext';

const CartScreen: React.FC = () => {
  const { items, itemCount, updateQuantity, isLoading, subtotal } = useCart(); // <-- OBTENEMOS el subtotal
  const router = useRouter();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (itemCount === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>Tu carrito está vacío.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.product?.name || `Producto ID: ${item.product_id}`}</Text>
            <View style={styles.quantityControl}>
              <Button title="-" onPress={() => updateQuantity(item.id, item.quantity - 1)} />
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <Button title="+" onPress={() => updateQuantity(item.id, item.quantity + 1)} />
            </View>
            <Text style={styles.itemPrice}>${(item.unit_price * item.quantity / 100).toFixed(2)}</Text>
          </View>
        )}
      />
      <View style={styles.summaryContainer}>
          {/* <-- USAMOS el subtotal del contexto --> */}
          <Text style={styles.summaryText}>Total: ${(subtotal / 100).toFixed(2)}</Text>
          <Button title="Proceder al Pago" onPress={() => router.push('/checkout')} disabled={itemCount === 0} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { flex: 1, fontSize: 16, marginRight: 8 },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  quantityText: { marginHorizontal: 12, fontSize: 16, fontWeight: '500' },
  itemPrice: { fontSize: 16, fontWeight: 'bold', minWidth: 70, textAlign: 'right' },
  summaryContainer: { padding: 16, borderTopWidth: 1, borderTopColor: '#ccc', backgroundColor: '#f9f9f9' },
  summaryText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

export default CartScreen;