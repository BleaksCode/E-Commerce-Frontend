// src/components/LoadingSpinner.tsx

import type React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

interface LoadingSpinnerProps {
  size?: "small" | "large"
  color?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = "#7C3AED", // Color actualizado a púrpura
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F3FF", // Fondo actualizado
  },
})

export default LoadingSpinner
