# MarmitaFit - Mobile App (Em Desenvolvimento)

Este repositório contém o aplicativo mobile da plataforma **MarmitaFit**, desenvolvido com **React Native** e **Expo**. O foco do projeto é oferecer uma experiência fluida e segura para o usuário final, garantindo a persistência da sessão e a integridade da comunicação com a API.

## 🚀 Sobre o Aplicativo

O app MarmitaFit foi projetado com uma arquitetura moderna para lidar com autenticação complexa e estados globais. Atualmente, o projeto foca na robustez do fluxo de acesso, utilizando camadas de segurança nativa para proteger os dados do usuário.

## 🛠 Stack Tecnológica

* **Framework:** React Native (Expo Managed Workflow).
* **Navegação:** React Navigation (Native Stack).
* **Gerenciamento de Estado:** React Context API (AuthContext).
* **Formulários:** React Hook Form com validação via Yup.
* **Segurança:** Expo Secure Store (Criptografia de tokens no dispositivo).
* **Comunicação:** Axios com interceptores para renovação automática de sessão (Refresh Token).
* **UI/Feedback:** React Native Toast Message para notificações e Expo Splash Screen para controle de carregamento inicial.

## 🏗 Arquitetura e Funcionalidades Implementadas

O aplicativo segue um padrão de organização focado em separação de responsabilidades (Services, Contexts, Screens e Configs):

### 1. Gestão de Autenticação e Sessão
* **Fluxo de Login:** Validação de credenciais integrada ao backend.
* **Persistência Segura:** Uso do `SecureStore` (Keychain/Keystore) para armazenar tokens sensíveis, garantindo que a sessão não seja perdida ao fechar o app.
* **Device ID:** Geração e persistência de um identificador único por dispositivo para controle de múltiplas sessões no backend.

### 2. Infraestrutura de Rede Inteligente
* **Interceptor de Refresh Token:** Sistema automático que detecta tokens expirados e renova a sessão em segundo plano, sem que o usuário precise logar novamente.
* **Fila de Requisições:** Gerenciamento de múltiplas chamadas à API; se o token expira, as requisições aguardam a renovação para serem executadas com sucesso.
* **Retry System:** Implementação de tentativas automáticas em caso de falhas transitórias de rede.

### 3. Navegação Protegida
* **Rotas Dinâmicas:** Separação física entre o fluxo de autenticação (Login, Cadastro, Recuperação) e o fluxo principal (Home), protegendo telas privadas de usuários não autenticados.
* **Feedback ao Usuário:** Validação de campos em tempo real e Toasts personalizados para sucesso ou erro nas operações.

## 📈 Status do Desenvolvimento

O projeto está em **fase ativa de desenvolvimento**. As seguintes funcionalidades já estão operacionais:
- [x] Arquitetura de segurança com tokens JWT (Access/Refresh).
- [x] Interceptor de renovação automática de sessão.
- [x] Persistência de dados em armazenamento criptografado.
- [x] Fluxo de Login e Logout completo.
- [ ] Finalização da interface de Cadastro e Recuperação de Senha.
- [ ] Implementação do Catálogo de Marmitas.

---

### 📄 Direitos e Propriedade

Este é um projeto **privado e autoral**. O código aqui exposto serve exclusivamente como demonstração de competências técnicas em engenharia de software mobile. Não é permitida a reprodução, distribuição ou utilização comercial de qualquer parte deste código sem autorização prévia.

**© 2026. Todos os direitos reservados.**
