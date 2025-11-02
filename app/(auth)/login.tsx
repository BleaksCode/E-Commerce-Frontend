"use client"

// app/(auth)/login.tsx
import { useRouter } from "expo-router"
import type React from "react"
import { useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import authService from "../../src/services/authService"
// CORREGIDO: La importación ahora apunta al contexto que creamos
import { useAuth } from "../../src/context/AuthContext"

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, ingresa tu email y contraseña.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor, ingresa un email válido.")
      return
    }

    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.")
      return
    }

    setIsLoading(true)

    try {
      // 1. Llama a login UNA VEZ (el servicio guarda el token)
      await authService.login(email, password)
      
      // 2. Obtiene el perfil del usuario (usando el token guardado)
      const profile = await authService.getProfile()

      // 3. Verifica que el perfil se obtuvo
      if (profile) {
        // 4. Pasa el perfil correcto al contexto
        signIn(profile)
        
        // 5. Muestra UN solo mensaje de éxito
        Alert.alert("¡Bienvenido!", `Inicio de sesión exitoso`)
        // 6. NO llames a router.back(). El layout principal se encargará
        //    de la navegación automáticamente al detectar el cambio en `signIn`.
      } else {
        // Caso borde: el login fue exitoso pero el perfil no se pudo obtener
        throw new Error("Login exitoso, pero no se pudo obtener el perfil.");
      }

    } catch (error: any) {
      console.error("Login error:", error)

      if (error.response?.status === 401) {
        Alert.alert("Error", "Email o contraseña incorrectos.")
      } else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        Alert.alert("Error", "Tiempo de espera agotado. Verifica tu conexión.")
      } else if (error.message.includes("Network Error")) {
        Alert.alert("Error de conexión", "No se pudo conectar al servidor. Verifica tu conexión a internet.")
      } else {
        Alert.alert("Error", "No se pudo iniciar sesión. Inténtalo de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña (mín. 8 caracteres)"
          placeholderTextColor="#9CA3AF"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          editable={!isLoading}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#7C3AED" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          disabled={isLoading}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            ¿No tienes una cuenta? <Text style={styles.linkTextBold}>Regístrate</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} disabled={isLoading}>
          <Text style={styles.backText}>Volver sin iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5F3FF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    color: "#1F2937",
  },
  input: {
    height: 56,
    borderColor: "#E5E7EB",
    borderWidth: 1.5,
    marginBottom: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#1F2937",
  },
  button: {
    backgroundColor: "#7C3AED",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 15,
  },
  linkTextBold: {
    color: "#7C3AED",
    fontWeight: "600",
  },
  backButton: {
    marginTop: 12,
  },
  backText: {
    color: "#9CA3AF",
    textAlign: "center",
    fontSize: 14,
  },
  loader: {
    marginVertical: 20,
  },
})

export default LoginScreen
