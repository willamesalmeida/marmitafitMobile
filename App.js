import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/Auth/LoginScreen";
import HomeScreen from "./src/screens/Home/HomeScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/Auth/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
  async function prepare() {
    try {
      await SplashScreen.preventAutoHideAsync();

      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 3000);

    } catch (e) {
      console.warn(e);
    }
  }

  prepare();
}, []);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, title: 'Login' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: true, title: "Início" }}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
