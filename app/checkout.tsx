"use client"

// app/checkout.tsx
import { Stack, useRouter } from "expo-router"
import type React from "react"
import { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import LoadingSpinner from "../src/components/LoadingSpinner"
import { useAuth } from "../src/context/AuthContext"
import { useCart } from "../src/context/CartContext"
import addressService from "../src/services/addressService"
import orderService from "../src/services/orderService"
import type { Address } from "../src/types/api"

const CheckoutScreen: React.FC = () => {
  const router = useRouter()
  const { items, clearCart, itemCount } = useCart()
  const { userProfile } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true)
      const userAddresses = await addressService.getMyAddresses()
      setAddresses(userAddresses)
      const defaultAddress = userAddresses.find((a) => a.is_default)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id)
      }
      setIsLoading(false)
    }
    loadAddresses()
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const totalAmount = subtotal

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      Alert.alert("Error", "Por favor, selecciona una dirección de envío.")
      return
    }
    if (!userProfile) {
      Alert.alert("Error", "No se pudo verificar el usuario.")
      return
    }

    setIsLoading(true)
    try {
      await orderService.createOrder({
        user_id: userProfile.sub,
        total_amount: totalAmount,
        subtotal: subtotal,
        shipping_address_id: selectedAddressId,
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product?.name || "Producto",
          product_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.unit_price * item.quantity,
        })),
      })

      Alert.alert("¡Pedido Realizado!", "Tu pedido ha sido procesado exitosamente.")
      clearCart()
      router.replace("/(tabs)")
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al procesar tu pedido.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <>
      <Stack.Screen options={{ title: "Finalizar Compra" }} />
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product?.name || `ID: ${item.product_id}`}
                </Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${((item.unit_price * item.quantity) / 100).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dirección de Envío</Text>
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                onPress={() => setSelectedAddressId(addr.id)}
                style={[styles.addressBox, selectedAddressId === addr.id && styles.addressSelected]}
              >
                <View style={styles.radioButton}>
                  {selectedAddressId === addr.id && <View style={styles.radioButtonInner} />}
                </View>
                <View style={styles.addressContent}>
                  <Text style={styles.addressText}>{addr.address_line1}</Text>
                  <Text style={styles.addressTextSecondary}>
                    {addr.city}, {addr.state} {addr.postal_code}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noAddressText}>No tienes direcciones guardadas. Añade una desde tu perfil.</Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${(subtotal / 100).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío:</Text>
            <Text style={styles.summaryValueFree}>Gratis</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${(totalAmount / 100).toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.payButton, (isLoading || itemCount === 0) && styles.payButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isLoading || itemCount === 0}
        >
          <Text style={styles.payButtonText}>{isLoading ? "Procesando..." : "Confirmar y Pagar"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F3FF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F2937",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: "#4B5563",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  addressSelected: {
    borderColor: "#7C3AED",
    backgroundColor: "#F5F3FF",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7C3AED",
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  addressTextSecondary: {
    fontSize: 14,
    color: "#6B7280",
  },
  noAddressText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  summaryValueFree: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7C3AED",
  },
  payButton: {
    backgroundColor: "#7C3AED",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0.1,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
})

export default CheckoutScreen
