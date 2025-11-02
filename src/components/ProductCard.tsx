// src/components/ProductCard.tsx
import type React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { Product } from "../types/api"

interface ProductCardProps {
  product: Product
  onPress: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const priceAsCurrency = product.price / 100
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl || "https://via.placeholder.com/150" }} style={styles.image} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>${priceAsCurrency.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 22,
  },
  price: {
    fontSize: 20,
    color: "#7C3AED",
    fontWeight: "bold",
  },
})

export default ProductCard
