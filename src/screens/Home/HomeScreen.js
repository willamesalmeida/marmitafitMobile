import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../services/api"; // ← importante: importe a instância api
import styles from "./styles";

import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const testProtectedRequest = async () => {
    setLoading(true);
    setResult("");
    try {
      // Mude '/products' para qualquer rota protegida que exista no seu backend
      const res = await api.get("/products"); // ou '/me', '/orders', etc.
      setResult(
        "Sucesso! Dados recebidos: " +
          JSON.stringify(res.data).substring(0, 200) +
          "...",
      );
    } catch (err) {
      setResult("Erro: " + err.message);
      console.error("Request falhou:", err);
    } finally {
      setLoading(false);
    }
  };

  const hndleLogout = async () => {
    await logout();
    
    Toast.show({
      type: "success",
      text1: "Logout realizado com sucesso!",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo </Text>
        <Text style={styles.subtitle}>Você está logado com sucesso! 🎉</Text>

        <Button
          title="Testar Request Protegido"
          onPress={testProtectedRequest}
        />

        {loading && (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size="large"
            color="#22c55e"
          />
        )}
        {result ? <Text style={styles.result}>{result}</Text> : null}

        <View style={{ marginTop: 30 }}>
          <Button title="Logout" color="#ef4444" onPress={hndleLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}
