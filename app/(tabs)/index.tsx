"use client"

// app/(tabs)/index.tsx
import { useRouter } from "expo-router"
import type React from "react"
import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import LoadingSpinner from "../../src/components/LoadingSpinner"
import ProductCard from "../../src/components/ProductCard"
import categoryService from "../../src/services/categoryService"
import productService from "../../src/services/productService"
import type { Category, Product } from "../../src/types/api"

const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryChip, selectedCategory === item.id && styles.categoryChipSelected]}
      onPress={() => setSelectedCategory((prev) => (prev === item.id ? null : item.id))}
    >
      <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextSelected]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  const filteredProducts = selectedCategory ? products.filter((p) => p.category_id === selectedCategory) : products

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={[{ id: 0, name: "Todos" }, ...categories]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                (selectedCategory === item.id || (item.id === 0 && selectedCategory === null)) &&
                  styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(item.id === 0 ? null : item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  (selectedCategory === item.id || (item.id === 0 && selectedCategory === null)) &&
                    styles.categoryTextSelected,
                ]}
              >
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
              router.push({
                pathname: "/products/[id]",
                params: { id: item.id },
              })
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay productos en esta categoría.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  categoryList: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipSelected: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.3,
  },
  categoryText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 15,
  },
  categoryTextSelected: {
    color: "#FFFFFF",
  },
  productList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6B7280",
  },
})

export default HomeScreen
