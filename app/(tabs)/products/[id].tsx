// app/(tabs)/product/[id].tsx

import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import LoadingSpinner from '../../../src/components/LoadingSpinner';
import { useCart } from '../../../src/context/CartContext'; // Importa el hook del carrito
import productService from '../../../src/services/productService';
import { Product } from '../../../src/types/api';

const ProductDetailScreen: React.FC = () => {
  // Obtenemos el 'id' de la URL (ej. /product/3)
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addToCart } = useCart(); // Obtén la función del contexto

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setIsLoading(true);
      const productId = parseInt(id, 10);
      if (!isNaN(productId)) {
        const productData = await productService.getProductById(productId);
        setProduct(productData);
      }
      setIsLoading(false);
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Producto no encontrado.</Text>
      </View>
    );
  }

  // Buscamos la imagen principal o usamos la primera que encontremos
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView style={styles.container}>
        <Image 
          source={{ uri: primaryImage?.image_path || 'https://via.placeholder.com/400' }} 
          style={styles.image} 
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.stock}>
            {product.stock_quantity ? `${product.stock_quantity} en stock` : 'Agotado'}
          </Text>
          <Text style={styles.description}>
            {product.description || 'Este producto no tiene descripción.'}
          </Text>
          <View style={styles.buttonContainer}>
            <Button 
          title="Añadir al Carrito" 
          onPress={() => {
            if (product) {
              addToCart(product.id, product.price);
            }
          }} 
          disabled={!product || (product.stock_quantity ?? 0) === 0}
        />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  detailsContainer: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 22, color: '#007bff', marginBottom: 16 },
  stock: { fontSize: 16, color: 'gray', marginBottom: 16, fontStyle: 'italic' },
  description: { fontSize: 16, lineHeight: 24, color: '#333' },
  buttonContainer: { marginTop: 20 },
});

export default ProductDetailScreen;