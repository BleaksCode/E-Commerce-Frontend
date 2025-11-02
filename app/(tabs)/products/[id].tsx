"use client"

// app/(tabs)/product/[id].tsx

import { Stack, useLocalSearchParams } from "expo-router"
import type React from "react"
import { useEffect, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import LoadingSpinner from "../../../src/components/LoadingSpinner"
import { useCart } from "../../../src/context/CartContext"
import productService from "../../../src/services/productService"
import type { Product } from "../../../src/types/api"

const ProductDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!id) return

    const loadProduct = async () => {
      setIsLoading(true)
      const productId = Number.parseInt(id, 10)
      if (!isNaN(productId)) {
        const productData = await productService.getProductById(productId)
        setProduct(productData)
      }
      setIsLoading(false)
    }

    loadProduct()
  }, [id])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Producto no encontrado.</Text>
      </View>
    )
  }

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: primaryImage?.image_path || "https://via.placeholder.com/400" }} style={styles.image} />
        </View>
        <View style={styles.detailsCard}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <View style={styles.stockBadge}>
            <Text style={styles.stock}>
              {product.stock_quantity ? `${product.stock_quantity} en stock` : "Agotado"}
            </Text>
          </View>
          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.description}>{product.description || "Este producto no tiene descripción."}</Text>
          <TouchableOpacity
            style={[styles.button, (!product || (product.stock_quantity ?? 0) === 0) && styles.buttonDisabled]}
            onPress={() => {
              if (product) {
                addToCart(product, 1) // <--- CORREGIDO
    }
  }}
  disabled={!product || (product.stock_quantity ?? 0) === 0}
>
            <Text style={styles.buttonText}>
              {(product.stock_quantity ?? 0) === 0 ? "Agotado" : "Añadir al Carrito"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 24,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1F2937",
    lineHeight: 32,
  },
  price: {
    fontSize: 28,
    color: "#7C3AED",
    marginBottom: 16,
    fontWeight: "700",
  },
  stockBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  stock: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#4B5563",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#7C3AED",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 40,
  },
})

export default ProductDetailScreen
