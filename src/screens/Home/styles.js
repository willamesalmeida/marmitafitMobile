import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  
  container: { flex: 1, backgroundColor: "#ffffff"},
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  subtitle: { fontSize: 18, color: "#4b5563", marginBottom: 40 },
  result: { marginTop: 20, fontSize: 14, textAlign: "center", color: "#333" },
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  subtitle: { fontSize: 18, color: "#4b5563", marginBottom: 40 },
  result: { marginTop: 20, fontSize: 14, textAlign: "center", color: "#333" },
});
