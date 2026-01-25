import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView as SafeAreaViewContext } from "react-native-safe-area-context";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigation } from "@react-navigation/native";
import { login } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import Toast from "react-native-toast-message";

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Email inválido")
    .required("O email é obrigatório"),
  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(6, "Minimo 6 digitos, 1 especial, 1 letra maiuscula e 1 minusculas"),
});

export default function LoginScreen() {
  const { setUser } = useAuth();
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    if(isLoading) return; // Previne múltiplos envios
    setIsLoading(true);

    console.log("dados válidos:", data);

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        const user = result.data.user;
        if (user) {
          setUser(user);
          Toast.show({
            type: "success",
            text1: "Login realizado com sucesso!",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Falha no login!",
            text2: "Dados do usuário não recebidos. Tente novamente.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Falha no login!",
          text2:
            result.message || "Verifique suas credenciais e tente novamente.",
        });
    
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ocorreu um erro inesperado!",
        text2: error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (err) => {
    setIsLoading(false);
    Toast.show({
      type: "error",
      text1: "Por favor, verifique os campos!",
    });
  };

  return (
    <SafeAreaViewContext style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/header-food.jpg")}
            style={styles.imageHeader}
            resizeMode="cover"
          />

          <View style={styles.content}>
            <Text style={styles.title}>Olá, novamente!</Text>

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
                    onChangeText={onChange} // importante: onChangeText
                    onBlur={onBlur} // importante: onBlur
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

            {/* Password */}
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
                      disabled={isLoading} // ← Desabilita durante loading
                      activeOpacity={0.7}
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

              {/* Botão de entrar */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit, onError)}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Não tem conta?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate("Register")}
              >
                Cadastre-se
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaViewContext>
  );
}
