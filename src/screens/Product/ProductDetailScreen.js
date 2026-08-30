import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./styles";
import api from "../../services/api";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  // useRoute permite acessar os parâmetros passados pela navegação
  const route = useRoute();
  // desestrutura o produto que foi passado como parâmetro
  const { product } = route.params;

  // pega o nome da primeira categoria do produto
  const categoryName = product.categories?.[0]?.category?.name || null;
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (isLoading) return; // Evita múltiplos cliques
    setIsLoading(true);
    try {
      await api.post("/cart", {
        productId: product.id,
        quantity: quantity,
      });
      Toast.show({
        type: "success",
        text1: "Produto adicionado ao carrinho!",
        text2: `${quantity}x ${product.name} adicionado.`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao adicionar produto ao carrinho.",
        text2: error.response?.data?.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* IMAGEM GRANDE */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* BOTÃO VOLTAR flutuando sobre a imagem */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>

        {/* BADGE DA CATEGORIA */}
        {categoryName && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryName}</Text>
          </View>
        )}
      </View>

      {/* CONTEÚDO ROLÁVEL */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* NOME E PREÇO */}
        <View style={styles.nameRow}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>
            R$ {Number(product.price).toFixed(2).replace(".", ",")}
          </Text>
        </View>

        {/* DIVISOR */}
        <View style={styles.divider} />

        {/* SELETO DE QUANTIDADE  */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantidade:</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={20} color="#22c55e" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Ionicons name="add" size={20} color="#22c55e" />
            </TouchableOpacity>
          </View>
        </View>
        {/* DIVISOR */}
        <View style={styles.divider} />

        {/* DESCRIÇÃO */}
        <Text style={styles.sectionTitle}>Descrição:</Text>
        <Text style={styles.description}>{product.description}</Text>
      </ScrollView>

      {/* BOTÃO FIXO NO RODAPÉ */}
      <View style={styles.footer}>
        {/* <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={20} color="#ffffff" />
          <Text style={styles.addToCartText}>Adicionar ao carrinho</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            isLoading && styles.addToCartButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Ionicons name="cart-outline" size={20} color="#ffffff" />
              <Text style={styles.addToCartText}>Adicionar ao carrinho</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
