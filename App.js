import { useEffect, useCallback, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


//importe das telas
import LoginScreen from "./src/screens/Auth/LoginScreen";
import HomeScreen from "./src/screens/Home/HomeScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/Auth/ForgotPasswordScreen";

import { getAccessToken } from "./src/services/secureStore";
SplashScreen.preventAutoHideAsync().catch(console.warn)

const Stack = createNativeStackNavigator();

export default function App() {

  const [ appIsReady, setAppIsReady] = useState(false)
  const [ initialRoute, setInitialRoute] = useState("Login")

  useEffect(() => {
  async function prepare() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      const token = await getAccessToken()
      if(token){
        setInitialRoute("Home")
        console.log("Auto lgin check", token ? "token encontrado --> vai pra home" : "sem tokne --> login")
      }else{
        console.log("Sem token --> vai para a login")
      }
    } catch (e) {
      console.warn("Erro na splash", e);
    } finally{
      setAppIsReady(true)
      await SplashScreen.hideAsync()
    }
  }

  prepare();
}, []);

/* const onLayoutRootView = useCallback(async() => {
  if(appIsReady) {
    await SplashScreen.hideAsync()
  }
}, [appIsReady]) */

if(!appIsReady){
  return null
}

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
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
