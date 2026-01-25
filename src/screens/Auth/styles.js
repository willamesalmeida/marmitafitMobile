import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageHeader: {
    width: '100%',
    height: height * 0.3, // ocupa cerca de 40% da tela
    borderBottomLeftRadius: 170,
    borderBottomRightRadius: 170,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    marginTop: -30, // sobrepõe um pouco a imagem para efeito suave
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937', // cinza escuro
    marginBottom: 30,
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#22c55e', // verde bonito pro MarmitaFit
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 32,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
    fontSize: 15,
  },
  signupText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 16,
    fontSize: 15,
  },
  signupLink: {
    color: '#22c55e',
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputWithIcon: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 5,
  },
  buttonDisabled: {
    backgroundColor: '#4ade80',
    opacity: 0.7,
  },
});