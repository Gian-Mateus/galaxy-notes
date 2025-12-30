# ⚡ Quick Start - Galaxy Notes Database

Guia rápido com os comandos mais usados no dia a dia.

## 🚀 Setup Inicial (primeira vez)

```bash
# 1. Entrar na pasta da API
cd packages/api

# 2. Instalar dependências
npm install

# 3. Criar arquivo .env (copiar do exemplo)
cp .env.example .env

# 4. Criar banco e rodar migrations
npx prisma migrate dev --name init

# 5. Gerar Prisma Client
npx prisma generate

# 6. Popular com dados de exemplo (opcional)
npx tsx prisma/seed.ts

# 7. Abrir interface visual
npx prisma studio
```

## 📝 Comandos do Dia a Dia

### Ver dados (Prisma Studio)
```bash
npx prisma studio
# Abre em http://localhost:5555
```

### Resetar banco (CUIDADO!)
```bash
npx prisma migrate reset
# Apaga tudo e recria
```

### Popular dados novamente
```bash
npx tsx prisma/seed.ts
```

### Criar nova migration
```bash
npx prisma migrate dev --name nome_da_mudanca
```

### Regenerar Prisma Client (após mudar schema)
```bash
npx prisma generate
```

### Formatar schema.prisma
```bash
npx prisma format
```

### Ver status das migrations
```bash
npx prisma migrate status
```

## 🔍 Debug

### Ver queries SQL executadas
No código TypeScript:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});
```

### Verificar conexão do banco
```bash
npx prisma db execute --stdin <<< "SELECT 1"
```

### Ver estrutura do banco
```bash
sqlite3 prisma/dev.db ".schema"
```

## 📊 Exemplos de Código Rápido

### Setup do Prisma
```typescript
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
```

### Criar nota
```typescript
const note = await prisma.item.create({
  data: {
    workspaceId: 'workspace_id',
    type: 'note',
    title: 'Minha Nota',
    content: '# Conteúdo',
    createdById: 'user_id'
  }
});
```

### Buscar todos os items de um workspace
```typescript
const items = await prisma.item.findMany({
  where: {
    workspaceId: 'workspace_id',
    isArchived: false
  },
  include: {
    tasks: true,
    tags: { include: { tag: true } }
  },
  orderBy: { updatedAt: 'desc' }
});
```

### Criar tarefa
```typescript
const task = await prisma.task.create({
  data: {
    itemId: 'list_id',
    title: 'Fazer algo',
    status: 'todo',
    type: 'task',
    createdById: 'user_id'
  }
});
```

### Compartilhar item
```typescript
await prisma.share.create({
  data: {
    itemId: 'item_id',
    userId: 'user_id',
    permission: 'edit',
    createdById: 'owner_id'
  }
});
```

### Buscar tarefas pendentes
```typescript
const tasks = await prisma.task.findMany({
  where: {
    assignedToId: 'user_id',
    status: { in: ['todo', 'in_progress'] }
  },
  orderBy: { dueDate: 'asc' }
});
```

## 🗂️ Estrutura de Arquivos

```
packages/api/
├── prisma/
│   ├── schema.prisma          ← Schema do banco
│   ├── seed.ts                ← Dados de exemplo
│   ├── queries-examples.sql   ← Queries úteis
│   ├── README.md              ← Documentação completa
│   ├── QUICK_START.md         ← Este arquivo
│   └── dev.db                 ← Banco SQLite (gerado)
├── src/
│   ├── generated/
│   │   └── prisma/            ← Prisma Client (gerado)
│   └── types/
│       └── database.types.ts  ← Tipos e helpers
└── .env                       ← Configuração
```

## 🎯 Fluxo de Trabalho Típico

### 1. Mudar o schema
Edite `prisma/schema.prisma`

### 2. Criar migration
```bash
npx prisma migrate dev --name minha_mudanca
```

### 3. Usar no código
```typescript
// Prisma Client já atualizado automaticamente!
const result = await prisma.novoModel.create({ ... });
```

## 🔄 Resetar Tudo (Começar do Zero)

```bash
# Deletar banco
rm prisma/dev.db

# Recriar e popular
npx prisma migrate dev
npx tsx prisma/seed.ts
```

## 📚 Links Rápidos

- **Documentação Completa**: `prisma/README.md`
- **Queries SQL**: `prisma/queries-examples.sql`
- **Tipos TypeScript**: `src/types/database.types.ts`
- [Prisma Docs](https://www.prisma.io/docs)

## 💡 Dicas

1. **Sempre use transações** para operações múltiplas
2. **Use `select`** para buscar apenas campos necessários
3. **Índices já estão otimizados** no schema
4. **Prisma Studio** é seu melhor amigo para debug
5. **Migrations são versionadas** - commit elas no git

## 🆘 Problemas Comuns

### Erro "No Prisma Client"
```bash
npx prisma generate
```

### Erro de migration
```bash
npx prisma migrate reset
```

### Banco corrompido
```bash
rm prisma/dev.db
npx prisma migrate dev
```

---

**Pronto para começar! 🚀**