// app/(tabs)/index.tsx
import { useRouter } from 'expo-router'; // Importamos el router
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoadingSpinner from '../../src/components/LoadingSpinner'; // Usamos nuestro spinner
import ProductCard from '../../src/components/ProductCard';
import categoryService from '../../src/services/categoryService';
import productService from '../../src/services/productService';
import { Category, Product } from '../../src/types/api';

const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter(); // Obtenemos una instancia del router

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[styles.categoryChip, selectedCategory === item.id && styles.categoryChipSelected]}
      onPress={() => setSelectedCategory(prev => prev === item.id ? null : item.id)} // Permite deseleccionar
    >
      <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextSelected]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingSpinner />; // Usamos nuestro componente
  }

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={[{ id: 0, name: 'Todos' }, ...categories]} // Añadimos un chip para "Todos"
          renderItem={({ item }) => (
             <TouchableOpacity 
              style={[styles.categoryChip, (selectedCategory === item.id || (item.id === 0 && selectedCategory === null)) && styles.categoryChipSelected]}
              onPress={() => setSelectedCategory(item.id === 0 ? null : item.id)}
            >
              <Text style={[styles.categoryText, (selectedCategory === item.id || (item.id === 0 && selectedCategory === null)) && styles.categoryTextSelected]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => {
              // --- ESTA ES LA CORRECCIÓN ---
              // Usamos la sintaxis de objeto que es segura para TypeScript
              router.push({
                pathname: '/products/[id]',
                params: { id: item.id },
              });
            }} 
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No hay productos en esta categoría.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    categoryList: { paddingVertical: 10, paddingHorizontal: 16 },
    categoryChip: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
    },
    categoryChipSelected: {
        backgroundColor: '#007bff',
    },
    categoryText: {
        color: '#000',
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: '#fff',
    },
    productList: {
        paddingHorizontal: 16,
    },
});

export default HomeScreen;