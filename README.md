# 🌌 Galaxy Notes

Um aplicativo de notas inspirado no universo, com um editor de texto rico e uma interface galáctica imersiva.

## 📁 Estrutura do Projeto

Este é um monorepo que contém:

```
galaxy-notes/
├── packages/
│   ├── web/          # Frontend React + Vite
│   └── api/          # Backend Express + Prisma
├── parameters/       # Parâmetros e configurações
├── reference/        # Referências e documentação
└── package.json      # Configuração do monorepo
```

## 🚀 Começando

### Pré-requisitos

- Node.js (v18 ou superior)
- npm (v9 ou superior)

### Instalação

Na raiz do projeto, instale todas as dependências:

```bash
npm install
```

Isso instalará as dependências de todos os workspaces (api e web).

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
# Roda API e Web simultaneamente
npm run dev

# Roda apenas a API
npm run dev:api

# Roda apenas o Web
npm run dev:web
```

### Build

```bash
# Build do projeto web
npm run build

# ou
npm run build:web
```

### Produção

```bash
# Inicia a API em modo produção
npm run start:api
```

### Outros comandos

```bash
# Lint em todos os projetos
npm run lint

# Limpar node_modules
npm run clean

# Reinstalar todas as dependências
npm run install:all
```

## 📦 Workspaces

### @galaxy-notes/web

Frontend construído com:
- React 19
- Vite
- TypeScript
- React Router
- GSAP (animações)
- Lucide React (ícones)

### @galaxy-notes/api

Backend construído com:
- Express
- Prisma
- SQLite (Better SQLite3)
- CORS

## 🔧 Instalando Dependências em Workspaces Específicos

```bash
# Instalar no workspace web
npm install <pacote> --workspace=@galaxy-notes/web

# Instalar no workspace api
npm install <pacote> --workspace=@galaxy-notes/api

# Exemplo:
npm install slate slate-react --workspace=@galaxy-notes/web
```

## 📝 Desenvolvimento

1. O frontend roda em `http://localhost:5173` (Vite)
2. O backend roda em `http://localhost:3000` (Express)

## 🌟 Features

- Interface galáctica com animações suaves
- Editor de texto rico
- Sistema de notas com banco de dados
- Design responsivo

## 📄 Licença

Privado