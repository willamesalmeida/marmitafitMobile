import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // ─── Header ───────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },

  // ─── Barra de pesquisa ────────────────────────────────
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
    marginLeft: 8,
  },

  // ─── Chips de categoria ───────────────────────────────
  categoriesList: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
  },
  categoryChip: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  categoryChipSelected: {
    backgroundColor: "#22c55e",
  },
  categoryChipDefault: {
    backgroundColor: "#f3f4f6",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#ffffff",
  },
  categoryChipTextDefault: {
    color: "#6b7280",
  },

  // ─── Grid de produtos ──────────────────────────────────
  productsList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  productImageContainer: {
    height: 120,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#22c55e",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 13,
    color: "#22c55e",
    fontWeight: "700",
  },

  // ─── Estados vazios e loading ──────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#9ca3af",
  },
});