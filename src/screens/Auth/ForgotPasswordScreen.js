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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import styles from "./styles"; // ou crie um novo se preferir
import { requestPasswordReset } from "../../services/authService"; // vamos criar essa função

const schema = yup.object({
  email: yup
    .string()
    .email("Digite um email válido")
    .required("O email é obrigatório"),
});

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await requestPasswordReset(data.email);

      if (result.success) {
        setEmailSent(true);
        Toast.show({
          type: "success",
          text1: "Email enviado!",
          text2: "Verifique sua caixa de entrada (e spam).",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao enviar",
          text2: result.message || "Tente novamente mais tarde.",
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

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentCenter}>
          <Text style={styles.title}>Email enviado!</Text>
          <Text style={styles.subtitle}>
            Enviamos um link de recuperação para o email informado.
          </Text>
          <Text style={styles.subtitle}>
            Verifique sua caixa de entrada (e a pasta de spam).
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Voltar ao login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Esqueceu sua senha?</Text>
            <Text style={styles.subtitle}>
              Digite seu email e enviaremos um link para redefinir sua senha.
            </Text>

            {/* Campo Email */}
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

            {/* Botão Enviar */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  Enviar link de recuperação
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backLink}>Voltar ao login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
