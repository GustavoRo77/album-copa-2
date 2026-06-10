# Álbum da Copa do Mundo

Aplicativo mobile de álbum de figurinhas da Copa do Mundo, desenvolvido com **Ionic Vue** e **TypeScript**.

**Aluno:** Gustavo Rosseti

---

## Funcionalidades

- Cadastro e login de usuário com persistência via localStorage
- Álbum com 24 jogadores divididos em 4 grupos (A, B, C, D)
- Marcar e desmarcar figurinhas como coletadas
- Filtros: todas, coletadas e pendentes
- Busca por nome do jogador ou seleção
- Tag de raridade por figurinha: Comum, Rara e Brilhante
- Página de coletadas com botão de voltar
- Página Sobre com versão do app, Termos de Uso e Política de Privacidade
- Progresso salvo automaticamente

## Tecnologias

- [Ionic Framework 7](https://ionicframework.com/)
- [Vue 3](https://vuejs.org/) com Composition API
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## Como executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

Acesse `http://localhost:3000` após iniciar o servidor.

## Estrutura do projeto

```
src/
├── components/
│   ├── AppHeader.vue         # Cabeçalho com navegação
│   ├── StickerCard.vue       # Card individual de figurinha
│   ├── StickerList.vue       # Lista com busca e filtros
│   ├── LoginForm.vue         # Formulário de login
│   ├── RegisterForm.vue      # Formulário de cadastro
│   └── ResetPasswordForm.vue
├── composables/
│   ├── useAuth.ts            # Autenticação e sessão
│   └── useAlbum.ts           # Estado do álbum
├── data/
│   └── stickersData.ts       # Dados dos jogadores
├── router/
│   └── index.ts              # Rotas da aplicação
├── types/
│   └── index.ts              # Tipos TypeScript
└── views/
    ├── LoginView.vue
    ├── RegisterView.vue
    ├── ResetPasswordView.vue
    ├── AlbumView.vue
    ├── CollectedView.vue
    ├── ProfileView.vue
    └── AboutView.vue
```
