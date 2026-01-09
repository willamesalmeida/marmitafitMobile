import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import styles from './styles';

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  email: yup.string().trim().email('Email inválido').required('O email é obrigatório'),
  password: yup.string().required('A senha é obrigatória').min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',           // valida ao perder o foco
    reValidateMode: 'onChange', // revalida ao perder o foco novamente
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = data => {
    console.log('dados válidos:', data);
  };

  const onError = err => {
    console.log('erros do form:', err);
  };

  return (
    <SafeAreaViewContext style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Image source={require('../../assets/header-food.jpg')} style={styles.imageHeader} resizeMode="cover" />

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
                    onBlur={onBlur}         // importante: onBlur
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={true}
                  />
                )}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit, onError)}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>

            <Text style={styles.signupText}>
              Não tem conta? <Text style={styles.signupLink}>Cadastre-se</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaViewContext>
  );
}
