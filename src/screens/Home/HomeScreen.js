import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../services/api"; // ← importante: importe a instância api
import styles from "./styles";

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const testProtectedRequest = async () => {
    setLoading(true);
    setResult("");
    try {
      // Mude '/products' para qualquer rota protegida que exista no seu backend
      const res = await api.get('/products'); // ou '/me', '/orders', etc.
      setResult("Sucesso! Dados recebidos: " + JSON.stringify(res.data).substring(0, 200) + "...");
    } catch (err) {
      setResult("Erro: " + err.message);
      console.error("Request falhou:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao MarmitaFit!</Text>
        <Text style={styles.subtitle}>Você está logado com sucesso! 🎉</Text>

        <Button title="Testar Request Protegido" onPress={testProtectedRequest} />

        {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#22c55e" />}
        {result ? <Text style={styles.result}>{result}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

