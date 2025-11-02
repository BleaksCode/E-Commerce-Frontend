"use client"

// app/(auth)/register.tsx
import { useRouter } from "expo-router"
import type React from "react"
import { useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import authService from "../../src/services/authService"
import type { CreateUserPayload } from "../../src/types/api"

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres"
    }
    if (!/[A-Z]/.test(pass)) {
      return "La contraseña debe contener al menos una letra mayúscula"
    }
    if (!/[0-9]/.test(pass)) {
      return "La contraseña debe contener al menos un número"
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      return "La contraseña debe contener al menos un carácter especial"
    }
    return null
  }

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor, ingresa un email válido.")
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      Alert.alert("Contraseña inválida", passwordError)
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.")
      return
    }

    setIsLoading(true)

    try {
      const userData: CreateUserPayload = {
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
      }

      await authService.register(userData)

      Alert.alert("¡Registro exitoso!", "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.", [
        {
          text: "Ir a login",
          onPress: () => router.push("/(auth)/login"),
        },
      ])
    } catch (error: any) {
      console.error("Register error:", error)

      if (error.response?.status === 409) {
        Alert.alert("Error", "Este email ya está registrado.")
      } else if (error.response?.data?.message) {
        Alert.alert("Error", error.response.data.message)
      } else if (error.message.includes("Network Error")) {
        Alert.alert("Error de conexión", "No se pudo conectar al servidor. Verifica tu conexión a internet.")
      } else {
        Alert.alert("Error", "No se pudo completar el registro. Inténtalo de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Crear Cuenta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre *"
            placeholderTextColor="#9CA3AF"
            onChangeText={setFirstName}
            value={firstName}
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Apellido *"
            placeholderTextColor="#9CA3AF"
            onChangeText={setLastName}
            value={lastName}
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#9CA3AF"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Teléfono (opcional)"
            placeholderTextColor="#9CA3AF"
            onChangeText={setPhone}
            value={phone}
            keyboardType="phone-pad"
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña *"
            placeholderTextColor="#9CA3AF"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña *"
            placeholderTextColor="#9CA3AF"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <Text style={styles.hint}>
            * La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, números y caracteres especiales
          </Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#7C3AED" style={styles.loader} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => router.push("/(auth)/login")} disabled={isLoading} style={styles.linkButton}>
            <Text style={styles.linkText}>
              ¿Ya tienes una cuenta? <Text style={styles.linkTextBold}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#F5F3FF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
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
  hint: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 18,
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
  loader: {
    marginVertical: 20,
  },
})

export default RegisterScreen
