import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // ─── Imagem ───────────────────────────────────────────
  imageContainer: {
    height: height * 0.4,
    // ocupa 40% da altura da tela
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 48,
    // 48 para ficar abaixo da status bar
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "#22c55e",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },

  // ─── Conteúdo ─────────────────────────────────────────
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  productName: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    lineHeight: 28,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#22c55e",
    whiteSpace: "nowrap",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#e5e7eb",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
  },

  // ─── Rodapé ───────────────────────────────────────────
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  addToCartButton: {
    backgroundColor: "#22c55e",
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  // ─── Quantidade ───────────────────────────────────────────
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddinghorizontal: 24,
    paddingVertical: 16,
    // marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },

  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityButton: {
    width: 25,
    height: 30,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    minWidth: 24,
    textAlign: "center",
  },
});
