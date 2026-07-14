import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import styles from "./styles";

const { width } = Dimensions.get("window");
// largura do card = metade da tela menos padding e gap
const CARD_WIDTH = (width - 48 - 12) / 2;

export default function HomeScreen() {
  const { user, logout } = useAuth();

  // ─── Estados ───────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);


  // filtered product per text search 
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products; // trim() removes whitespace from both ends of a string
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  // ─── Efeitos ───────────────────────────────────────────
  useEffect(() => {
    fetchCategories();
  }, []);

  // re-executa sempre que selectedCategory mudar
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // ─── Funções ───────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log("Erro ao buscar categorias:", error.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      // monta a URL com ou sem filtro de categoria
      // se selectedCategory for null, busca todos os produtos
      // se tiver uma categoria selecionada, passa o categoryId como query param
      const url = selectedCategory
        ? `/products?categoryId=${selectedCategory}`
        : "/products";

      const response = await api.get(url);

      // a API retorna { data: [...produtos] }
      setProducts(response.data.data || []);
    } catch (error) {
      console.log("Erro ao buscar produtos:", error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // ─── Render do chip de categoria ───────────────────────
  const renderCategoryChip = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isSelected ? styles.categoryChipSelected : styles.categoryChipDefault,
        ]}
        onPress={() => setSelectedCategory(isSelected ? null : item.id)}
      >
        <Text
          style={[
            styles.categoryChipText,
            isSelected
              ? styles.categoryChipTextSelected
              : styles.categoryChipTextDefault,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // ─── Render do card de produto ─────────────────────────
  const renderProductCard = ({ item, index }) => {
    // index par = coluna esquerda (sem marginTop extra)
    // index ímpar = coluna direita (com marginTop para efeito escalonado)
    const isRightColumn = index % 2 !== 0;

    // pega o nome da primeira categoria do produto (se tiver)
    const categoryName = item.categories?.[0]?.category?.name || null;

    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          { width: CARD_WIDTH },
          isRightColumn && { marginTop: 24 },
          // aplica marginTop só nos cards da coluna direita
        ]}
        activeOpacity={0.8}
        onPress={() => {}}
        // futuramente vai navegar para a tela de detalhe
      >
        {/* Imagem do produto */}
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {/* Badge da categoria em cima da imagem */}
          {categoryName && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{categoryName}</Text>
            </View>
          )}
        </View>

        {/* Informações do produto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          {/* numberOfLines={2} limita o nome a 2 linhas 
              se for maior, adiciona "..." no final */}
          <Text style={styles.productPrice}>
            R$ {Number(item.price).toFixed(2).replace(".", ",")}
          </Text>
          {/* toFixed(2) formata com 2 casas decimais
              replace(".", ",") troca ponto por vírgula (padrão BR) */}
        </View>
      </TouchableOpacity>
    );
  };

  // ─── Componente de loading dos produtos ────────────────
  const renderProductsLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );

  // ─── Componente de lista vazia ─────────────────────────
  const renderEmptyProducts = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="basket-outline" size={48} color="#d1d5db" />
      <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
    </View>
  );

  // ─── Render principal ──────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>
            {user?.name?.split(" ")[0] || "Visitante"} 👋
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {}}
          >
            <Ionicons name="notifications-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: "#fee2e2" }]}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* CHIPS DE CATEGORIA */}
      {loadingCategories ? (
        <ActivityIndicator color="#22c55e" style={{ marginVertical: 12 }} />
      ) : (
        <FlatList
          data={[{ id: null, name: "Todas" }, ...categories]}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCategoryChip}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          style={{ flexGrow: 0 }}
          alwaysBounceHorizontal={false}
        />
      )}

      {/* GRID DE PRODUTOS */}
      <View style={{ flex: 1 }}>
        {loadingProducts ? (
          renderProductsLoading()
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderProductCard}
            numColumns={2}
            // numColumns={2} divide automaticamente em 2 colunas
            columnWrapperStyle={styles.productRow}
            // columnWrapperStyle estiliza o container de cada linha
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyProducts}
            // ListEmptyComponent aparece quando a lista está vazia
          />
        )}
      </View>
    </SafeAreaView>
  );
}