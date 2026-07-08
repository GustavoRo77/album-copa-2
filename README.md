# 🏆 Álbum de Figurinhas da Copa do Mundo

Aplicativo mobile desenvolvido com **Ionic Vue** e **Capacitor** para gerenciar coleção de figurinhas da Copa do Mundo, com sistema de autenticação, persistência em banco de dados SQLite e sistema de conquistas.

---

## 📋 Informações do Aluno

| Campo | Valor |
|-------|-------|
| **Nome completo** | [Seu nome aqui] |
| **Curso** | [Nome do curso] |
| **Unidade Curricular** | [Nome da UC] |
| **Semestre** | [Semestre atual] |

---

## 📚 Sobre o Projeto

O **Álbum de Figurinhas da Copa** é um aplicativo que permite aos usuários:

- ✅ Criar conta e fazer login
- ✅ Visualizar todas as figurinhas do álbum
- ✅ Marcar figurinhas como coletadas ou pendentes
- ✅ Filtrar figurinhas por status (todas/coletadas/pendentes)
- ✅ Pesquisar figurinhas por nome do jogador ou seleção
- ✅ Visualizar progresso do álbum
- ✅ **Sistema de conquistas (badges)** que desbloqueia automaticamente conforme a evolução do usuário
- ✅ Persistência de dados em **SQLite** (todos os dados são salvos no dispositivo)

---

## 🎯 Funcionalidades

### 🔐 Autenticação
- Cadastro com nome, e-mail e senha
- Login com e-mail e senha
- Recuperação de senha (simulação)
- Validação de campos obrigatórios
- Mensagens de erro para senhas fracas

### 📖 Álbum
- Lista de todas as figurinhas organizadas por grupo
- Cada figurinha exibe:
  - Nome do jogador
  - Seleção
  - Raridade (Comum/Rara/Brilhante)
  - Status (Coletada/Pendente)
- Resumo do álbum (total de figurinhas e completas)
- Marcar/Desmarcar figurinha como coletada

### 🔍 Filtros e Busca
- Pesquisa por nome do jogador ou seleção
- Filtros:
  - Todas
  - Apenas coletadas
  - Apenas pendentes

### 🏆 Sistema de Conquistas
O sistema gera automaticamente insígnias (badges) conforme a evolução do usuário:

| Conquista | Requisito | Ícone |
|-----------|-----------|-------|
| Primeira Figurinha | Coletar 1 figurinha | 🌟 |
| Iniciante | Coletar 10 figurinhas | 🎯 |
| Colecionador | Coletar 25 figurinhas | 📚 |
| Álbum em Construção | Coletar 50 figurinhas | 🏗️ |
| Caçador de Raras | Coletar 5 figurinhas raras | 🔍 |
| Especialista em Raras | Coletar 15 figurinhas raras | 🏆 |
| Brilho Inicial | Coletar 3 figurinhas brilhantes | ✨ |
| Mestre das Brilhantes | Coletar 10 figurinhas brilhantes | 💎 |
| Álbum Quase Completo | Completar 80% do álbum | 📖 |
| Campeão da Copa | Completar 100% do álbum | 🏆 |

### 📊 Persistência
- Todos os dados são armazenados em **SQLite** via Capacitor
- Dados persistidos:
  - Usuários
  - Figurinhas
  - Status de coleção
  - Conquistas desbloqueadas
- Dados permanecem salvos mesmo após fechar o aplicativo

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Vue.js | 3.x | Framework progressivo para UI |
| Ionic Framework | 7.x | Framework para apps híbridos |
| Capacitor | 5.x | Runtime para apps nativos |
| Capacitor SQLite | 5.x | Plugin para banco de dados SQLite |
| TypeScript | 5.x | Superset tipado do JavaScript |
| Vite | 4.x | Build tool e servidor de desenvolvimento |

---

## 📁 Estrutura do Projeto
src/
├── components/
│ ├── AppHeader.vue # Header com logout
│ ├── LoginForm.vue # Formulário de login
│ ├── RegisterForm.vue # Formulário de cadastro
│ ├── ResetPasswordForm.vue # Formulário de recuperação
│ ├── StickerCard.vue # Card de figurinha
│ └── StickerList.vue # Lista de figurinhas com filtros
│
├── composables/
│ ├── useAchievements.ts # Lógica de conquistas
│ ├── useAlbum.ts # Lógica do álbum
│ └── useAuth.ts # Lógica de autenticação
│
├── services/
│ └── database.ts # Configuração e funções do SQLite
│
├── views/
│ ├── AboutView.vue # Sobre o app
│ ├── AchievementsView.vue # Tela de conquistas
│ ├── AlbumView.vue # Tela principal do álbum
│ ├── CollectedView.vue # Tela de figurinhas coletadas
│ ├── LoginView.vue # Tela de login
│ ├── ProfileView.vue # Perfil do usuário
│ ├── RegisterView.vue # Tela de cadastro
│ └── ResetPasswordView.vue # Tela de recuperação
│
├── router/
│ └── index.ts # Configuração de rotas
│
├── theme/
│ └── variables.css # Variáveis de estilo
│
├── types/
│ └── index.ts # Tipos TypeScript
│
├── App.vue # Componente raiz
└── main.ts # Ponto de entrada

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 16.x ou superior
- npm ou yarn

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/album-copa-2.git
cd album-copa-2

# 2. Instalar dependências
npm install

# 3. Executar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build

# 5. Sincronizar com Capacitor (para dispositivos móveis)
npm run build
npx cap sync
Acessar no navegador
Após rodar npm run dev, abra:

