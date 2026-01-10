import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";


export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem vindo ao marmitafit</Text>
        <Text style={styles.subtitle}>Você está logado com sucesso!</Text>
      </View>
    </SafeAreaView>
  );
}
