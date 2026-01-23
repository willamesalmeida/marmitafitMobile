import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast, { BaseToast } from "react-native-toast-message";

// Importe seu Provider e o Hook
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

// Telas
import LoginScreen from "./src/screens/Auth/LoginScreen";
import HomeScreen from "./src/screens/Home/HomeScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/Auth/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

// 1. Configuração do Toast (Mantive a sua)
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ minHeight: 80, width: "90%", marginTop: "230%", borderLeftColor: "#22c55e", alignSelf: "center" }}
      text1Style={{ fontSize: 18 }}
      text1={props.text1}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{ minHeight: 80, width: "90%", marginTop: "230%", borderLeftColor: "#ef4444", alignSelf: "center" }}
      text1Style={{ fontSize: 18 }}
      text1={props.text1}
    />
  ),
};

SplashScreen.preventAutoHideAsync().catch(console.warn);

// 2. COMPONENTE DE NAVEGAÇÃO (Onde o 'signed' é implementado)
function Navigation() {
  const { signed, loading } = useAuth(); // Aqui pegamos o estado global

  // Enquanto o context verifica o token no secureStore, não mostramos nada
  if (loading) return null; 

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {signed ? (
          // --- ROTAS PARA USUÁRIOS LOGADOS ---
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: true, title: "Início" }}
            />
          </Stack.Group>
        ) : (
          // --- ROTAS PARA USUÁRIOS NÃO LOGADOS ---
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: true, title: "Cadastro" }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen} 
              options={{ headerShown: true, title: "Recuperar Senha" }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

// 3. EXPORT PRINCIPAL
export default function App() {
  // O AuthProvider DEVE envolver quem usa o useAuth (no caso, o componente Navigation)
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}