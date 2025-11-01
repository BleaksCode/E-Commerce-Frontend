// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import cartService from '../services/cartService';
import { CartItem, Product, ShoppingCart } from '../types/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: ShoppingCart | null;
  items: CartItem[];
  itemCount: number;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, newQuantity: number) => Promise<void>;
  clearCart: () => void; // La función para limpiar el carrito
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      setItems([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const userCart = await cartService.getMyCart();
    setCart(userCart);
    setItems(userCart?.items || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (product: Product, quantity: number) => {
    if (!cart) return;
    await cartService.addItemToCart({
      cart_id: cart.id,
      product_id: product.id,
      quantity: quantity,
      unit_price: product.price, // Precio en centavos
    });
    await fetchCart();
  };

  const removeFromCart = async (itemId: number) => {
    await cartService.removeItemFromCart(itemId);
    await fetchCart();
  };
  
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      await cartService.updateItemQuantity(itemId, newQuantity);
    } else {
      await removeFromCart(itemId);
    }
    await fetchCart();
  };

  const clearCart = () => {
    setCart(null);
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0); // <-- AÑADIDO: Cálculo del subtotal
  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        items, 
        itemCount, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        isLoading,
        clearCart,
        subtotal // Ahora 'clearCart' está correctamente definido y pasado
      }}
    >
      {children}
    </CartContext.Provider>
  );
};