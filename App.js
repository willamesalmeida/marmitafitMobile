import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast, { BaseToast } from "react-native-toast-message";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

import LoginScreen from "./src/screens/Auth/LoginScreen";
import HomeScreen from "./src/screens/Home/HomeScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/Auth/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ minHeight: 80, width: "90%", marginTop: "20%", borderLeftColor: "#22c55e", alignSelf: "center" }}
      text1Style={{ fontSize: 18 }}
      text1={props.text1}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{ minHeight: 80, width: "90%", marginTop: "20%", borderLeftColor: "#ef4444", alignSelf: "center" }}
      text1Style={{ fontSize: 18 }}
      text1={props.text1}
    />
  ),
};

// Impede o splash de sumir sozinho
SplashScreen.preventAutoHideAsync().catch(console.warn);

function Navigation() {
  const { signed, loading } = useAuth();

  // effect para esconder o splash screeen
  useEffect(() => {
    async function hideSplash() {
      if (!loading) {
        // Quando o carregamento termina, escondemos o Splash Screen
        await SplashScreen.hideAsync().catch(() => {});
      }
    }
    hideSplash();
  }, [loading]);

  if (loading) return null; 

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {signed ? (
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: true, title: "Início" }}
            />
          </Stack.Group>
        ) : (
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

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}