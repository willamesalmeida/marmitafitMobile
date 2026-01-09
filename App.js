import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from './src/screens/Auth/LoginScreen';

export default function App() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 3000); // Mantém a splash screen por 3 segundos
  }, []);

  return (
    <LoginScreen />
  );
}
