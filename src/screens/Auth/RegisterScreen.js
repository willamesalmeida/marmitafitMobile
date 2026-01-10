import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titleText}>
          Tela de Cadastro (em construção)
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // opcional: branco como na login
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",       // corrigido: fontWeight (não fontWeigth)
    textAlign: "center",
    color: '#1f2937',         // cor consistente com sua tela de login
  },
});