// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types/api';
import { clearAuthData, getToken, getUser } from '../utils/authHelper';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  authLoading: boolean; // <-- NUEVO: Para saber si estamos comprobando la sesión
  signIn: (profile: UserProfile) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // <-- NUEVO: Empezamos cargando

  useEffect(() => {
    // Esta función se ejecuta solo una vez al iniciar la app
    const loadSession = async () => {
      try {
        const token = await getToken();
        const user = await getUser();

        if (token && user) {
          // Si encontramos token y usuario, iniciamos sesión
          setUserProfile(user);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        // Haya o no sesión, hemos terminado de comprobar.
        setAuthLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setUserProfile(null);
    setIsAuthenticated(false);
    clearAuthData(); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, authLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}