import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { register } from "../../services/authService";
import { Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const schema = yup.object({
  name: yup
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .required("O nome é obrigatório"),
  email: yup
    .string()
    .email("Digite um email válido")
    .required("O email é obrigatório"),
  password: yup
    .string()
    .min(8, "Mínimo 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
      "A senha deve ter 1 maiúscula, 1 minúscula e 1 caractere especial (!@#$%^&*)",
    )
    .required("A senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("A confirmação de senha é obrigatória"),
});

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await register(
        data.name,
        data.email,
        data.password,
        data.confirmPassword,
      );

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Conta criada com sucesso!",
          text2: "Faça login para continuar.",
        });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao criar conta",
          text2: result.message || "Tente novamente.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Algo deu errado",
        text2: error.message || "Verifique sua conexão.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "une"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/header-food.jpg")}
            style={styles.imageHeader}
            resizeMode="cover"
          />

          <View style={styles.content}>
            <Text style={styles.title}>Criar conta</Text>

            {/* Nome */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu email"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.inputWithIcon]}
                      placeholder="Digite sua senha"
                      placeholderTextColor="#9ca3af"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={24}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.inputWithIcon]}
                      placeholder="Confirme sua senha"
                      placeholderTextColor="#9ca3af"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={24}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Botão */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Criar conta</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: 20 }} />

            <Text style={styles.signupText}>
              Já tem conta?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate("Login")}
              >
                Faça login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff", // opcional: branco como na login
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },
//   titleText: {
//     fontSize: 32,
//     fontWeight: "bold", // corrigido: fontWeight (não fontWeigth)
//     textAlign: "center",
//     color: "#1f2937", // cor consistente com sua tela de login
//   },
// });
