import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";


export default function CartScreen() {
 return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Carrinho</Text>
        <Text style={styles.subtitle}>Em breve...</Text>
      </View>
    </SafeAreaView>
  );
}
