// src/types/api.ts

// --- Autenticación ---
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface UserProfile {
  sub: number; // ID del usuario
  email: string;
  iat?: number;
  exp?: number;
}

// --- Usuario ---
export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active?: boolean;
}

// --- NUEVO: Categorías (basado en schema.ts) ---
export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_path: string | null;
  parent_category_id: number | null;
}

// --- NUEVO: Direcciones (basado en schema.ts y DTO) ---
export interface Address {
  id: number;
  user_id: number;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface CreateAddressPayload {
  user_id: number; // El backend lo asignará, pero lo definimos por el DTO
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

// --- Productos (basado en schema.ts) ---
export interface Product {
  id: number;
  name: string;
  description: string | null;
  // El backend lo guarda como entero (centavos), lo recibiremos como número
  price: number; 
  compare_price: number;
  stock_quantity: number | null;
  sku: string;
  category_id: number;
  images?: ProductImage[]; // Mantenemos la asunción de que el backend adjuntará las imágenes
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string; // La URL de la imagen
  alt_text?: string;
  is_primary: boolean;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  // Para la UI, es útil tener los detalles del producto aquí
  product?: Product; 
}

// NUEVO: Representa el carrito de compras de un usuario
export interface ShoppingCart {
  id: number;
  user_id: number;
  items: CartItem[]; // El backend nos dará los items anidados
}

// NUEVO: Define el payload para añadir un item al carrito
export interface AddToCartPayload {
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number; // Precio en centavos
  quantity: number;
}

// NUEVO: Representa un pedido completo
export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number; // Total en centavos
  shipping_address_id: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[]; // El backend debería anidar los items
  created_at: string;
}

// NUEVO: Define el payload para crear un pedido
export interface CreateOrderPayload {
  user_id: number; // Se obtendrá del token en el backend
  total_amount: number;
  subtotal: number;
  shipping_address_id: number;
  items: Array<{
    product_id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    total_price: number;
  }>;
}