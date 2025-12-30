# 🗄️ Banco de Dados - Galaxy Notes

Documentação completa do schema do banco de dados SQLite usando Prisma ORM.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Instalação e Setup](#-instalação-e-setup)
- [Estrutura do Banco](#-estrutura-do-banco)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Queries Úteis](#-queries-úteis)
- [Migrações](#-migrações)
- [Performance](#-performance)

---

## 🎯 Visão Geral

O Galaxy Notes utiliza **SQLite** para desenvolvimento (e pode ser usado em produção para aplicações pequenas/médias) com **Prisma** como ORM.

### Por que SQLite?

✅ **Zero configuração** - arquivo único, sem servidor  
✅ **Perfeito para dev** - rápido, simples, portável  
✅ **Produção viável** - apps com até ~100k usuários ativos  
✅ **Migração fácil** - Prisma facilita migrar para PostgreSQL depois  

### Estrutura de Dados

```
Users (usuários)
  └── Workspaces (notebooks/áreas)
       └── Items (notas, listas, boards, calendários)
            ├── Tasks (tarefas, eventos, lembretes)
            │    └── Subtasks (checklist)
            ├── Shares (compartilhamentos)
            ├── Comments (comentários)
            └── Tags (etiquetas)
```

---

## 🚀 Instalação e Setup

### 1. Instalar dependências

```bash
cd packages/api
npm install
```

### 2. Configurar variável de ambiente

Crie um arquivo `.env` na raiz de `packages/api`:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Executar migrations

```bash
npx prisma migrate dev --name init
```

### 4. Gerar Prisma Client

```bash
npx prisma generate
```

### 5. Popular banco com dados de exemplo (opcional)

```bash
npx tsx prisma/seed.ts
```

### 6. Visualizar dados (Prisma Studio)

```bash
npx prisma studio
```

Abre interface visual em `http://localhost:5555`

---

## 📊 Estrutura do Banco

### 1. **Users** - Usuários

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Uso:**
- Autenticação e identificação
- Avatar pode ser emoji ou URL
- Relacionado a tudo no sistema

---

### 2. **Workspaces** - Áreas de Trabalho

```prisma
model Workspace {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String?  // hex: #FF6B6B
  icon        String?  // emoji: 🚀
  ownerId     String
}
```

**Uso:**
- Organizar items (Pessoal, Trabalho, Estudos, etc)
- Cada usuário pode ter vários workspaces
- Funciona como "notebooks" ou "pastas raiz"

---

### 3. **Items** - Itens Universais

```prisma
model Item {
  type        String   // 'note' | 'list' | 'board' | 'calendar'
  title       String
  content     String?  // Markdown ou JSON stringificado
  metadata    String?  // JSON com configs específicas
  position    Int
  parentId    String?  // Para subpáginas
  isFavorite  Boolean
  isArchived  Boolean
}
```

**Tipos de Items:**

#### 📝 **Note** (Nota)
```typescript
{
  type: 'note',
  title: 'Minha Nota',
  content: '# Título\n\nConteúdo em **Markdown**',
  metadata: null
}
```

#### ✅ **List** (Lista de Tarefas)
```typescript
{
  type: 'list',
  title: 'Compras do Mercado',
  content: null,
  metadata: null
  // Tasks são criadas separadamente
}
```

#### 📊 **Board** (Quadro Kanban)
```typescript
{
  type: 'board',
  title: 'Sprint 1',
  content: null,
  metadata: JSON.stringify({
    columns: ['todo', 'doing', 'done'],
    color: '#667EEA'
  })
}
```

#### 📅 **Calendar** (Agenda)
```typescript
{
  type: 'calendar',
  title: 'Minha Agenda',
  content: null,
  metadata: JSON.stringify({
    defaultView: 'week'
  })
}
```

---

### 4. **Tasks** - Tarefas/Eventos

```prisma
model Task {
  title        String
  description  String?
  status       String    // 'todo', 'in_progress', 'done'
  type         String    // 'task', 'reminder', 'event'
  priority     String?   // 'low', 'medium', 'high', 'urgent'
  dueDate      DateTime?
  startTime    DateTime?
  endTime      DateTime?
}
```

**Tipos de Tasks:**

- **task**: tarefa em lista ou card no kanban
- **reminder**: lembrete com horário
- **event**: evento com início e fim

---

### 5. **Shares** - Compartilhamentos

```prisma
model Share {
  itemId      String
  userId      String
  permission  String  // 'view', 'edit', 'admin'
}
```

**Permissões:**
- `view`: apenas visualizar
- `edit`: editar conteúdo
- `admin`: editar + gerenciar compartilhamentos

---

### 6. **Tags** - Etiquetas

```prisma
model Tag {
  name  String @unique
  color String?
}
```

Tags globais reutilizáveis em vários items.

---

## 💻 Exemplos de Uso

### Setup do Prisma Client

```typescript
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
```

### Criar usuário

```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'João Silva',
    avatar: '👨‍💻'
  }
});
```

### Criar workspace

```typescript
const workspace = await prisma.workspace.create({
  data: {
    name: 'Pessoal',
    icon: '🏠',
    color: '#FF6B6B',
    ownerId: user.id
  }
});
```

### Criar nota simples

```typescript
const note = await prisma.item.create({
  data: {
    workspaceId: workspace.id,
    type: 'note',
    title: 'Minha primeira nota',
    content: '# Hello World\n\nConteúdo da nota...',
    createdById: user.id
  }
});
```

### Criar lista com tarefas

```typescript
// 1. Criar o item do tipo lista
const list = await prisma.item.create({
  data: {
    workspaceId: workspace.id,
    type: 'list',
    title: 'To-Do List',
    createdById: user.id
  }
});

// 2. Adicionar tarefas
await prisma.task.createMany({
  data: [
    {
      itemId: list.id,
      title: 'Tarefa 1',
      status: 'todo',
      type: 'task',
      position: 0,
      createdById: user.id
    },
    {
      itemId: list.id,
      title: 'Tarefa 2',
      status: 'todo',
      type: 'task',
      position: 1,
      createdById: user.id
    }
  ]
});
```

### Criar quadro Kanban

```typescript
const board = await prisma.item.create({
  data: {
    workspaceId: workspace.id,
    type: 'board',
    title: 'Projeto X',
    metadata: JSON.stringify({
      columns: ['backlog', 'todo', 'doing', 'review', 'done']
    }),
    createdById: user.id
  }
});

// Criar card no kanban
await prisma.task.create({
  data: {
    itemId: board.id,
    title: 'Implementar feature',
    description: 'Descrição detalhada...',
    status: 'todo',
    type: 'task',
    priority: 'high',
    dueDate: new Date('2024-02-01'),
    createdById: user.id
  }
});
```

### Compartilhar item

```typescript
await prisma.share.create({
  data: {
    itemId: note.id,
    userId: otherUser.id,
    permission: 'edit',
    createdById: user.id
  }
});
```

### Buscar items com includes

```typescript
// Items de um workspace com tasks
const items = await prisma.item.findMany({
  where: {
    workspaceId: workspace.id,
    isArchived: false
  },
  include: {
    tasks: {
      orderBy: { position: 'asc' }
    },
    tags: {
      include: { tag: true }
    },
    shares: {
      include: { user: true }
    }
  },
  orderBy: { updatedAt: 'desc' }
});
```

### Buscar items compartilhados comigo

```typescript
const sharedItems = await prisma.item.findMany({
  where: {
    shares: {
      some: {
        userId: currentUser.id
      }
    }
  },
  include: {
    workspace: true,
    createdBy: true,
    shares: {
      where: { userId: currentUser.id }
    }
  }
});
```

### Criar evento no calendário

```typescript
const calendar = await prisma.item.create({
  data: {
    workspaceId: workspace.id,
    type: 'calendar',
    title: 'Minha Agenda',
    createdById: user.id
  }
});

await prisma.task.create({
  data: {
    itemId: calendar.id,
    title: 'Reunião de equipe',
    type: 'event',
    status: 'todo',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T10:00:00'),
    createdById: user.id
  }
});
```

### Adicionar tags a um item

```typescript
// Criar tag (se não existir)
const tag = await prisma.tag.upsert({
  where: { name: 'importante' },
  create: { name: 'importante', color: '#FF4757' },
  update: {}
});

// Associar ao item
await prisma.itemTag.create({
  data: {
    itemId: note.id,
    tagId: tag.id
  }
});
```

---

## 🔍 Queries Úteis

### Dashboard de tarefas

```typescript
const stats = await prisma.task.groupBy({
  by: ['status'],
  where: {
    createdById: user.id,
    item: { isArchived: false }
  },
  _count: true
});

// Resultado: { status: 'todo', _count: 5 }, ...
```

### Tarefas atrasadas

```typescript
const overdue = await prisma.task.findMany({
  where: {
    assignedToId: user.id,
    status: { in: ['todo', 'in_progress'] },
    dueDate: { lt: new Date() }
  },
  include: {
    item: true
  },
  orderBy: { dueDate: 'asc' }
});
```

### Busca full-text (simplificada)

```typescript
const results = await prisma.item.findMany({
  where: {
    OR: [
      { title: { contains: searchTerm } },
      { content: { contains: searchTerm } }
    ],
    createdById: user.id,
    isArchived: false
  }
});
```

### Hierarquia de notas

```typescript
// Buscar nota e suas subpáginas
const noteWithChildren = await prisma.item.findUnique({
  where: { id: noteId },
  include: {
    children: {
      orderBy: { position: 'asc' }
    }
  }
});
```

---

## 🔄 Migrações

### Criar nova migration

```bash
npx prisma migrate dev --name nome_da_migration
```

### Aplicar migrations em produção

```bash
npx prisma migrate deploy
```

### Reset do banco (CUIDADO!)

```bash
npx prisma migrate reset
```

### Ver status das migrations

```bash
npx prisma migrate status
```

---

## ⚡ Performance

### Índices Criados

O schema já inclui índices otimizados:

```prisma
@@index([workspaceId])  // Items por workspace
@@index([type])         // Items por tipo
@@index([status])       // Tasks por status
@@index([dueDate])      // Tasks por prazo
@@index([userId])       // Shares por usuário
```

### Boas Práticas

1. **Use `select` para campos específicos**
```typescript
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
});
```

2. **Limite resultados com `take`**
```typescript
const recent = await prisma.item.findMany({
  take: 20,
  orderBy: { createdAt: 'desc' }
});
```

3. **Use transações para operações múltiplas**
```typescript
await prisma.$transaction([
  prisma.item.create({ data: itemData }),
  prisma.task.createMany({ data: tasksData })
]);
```

4. **Prefira `createMany` para inserções em lote**
```typescript
await prisma.task.createMany({
  data: arrayOfTasks,
  skipDuplicates: true
});
```

---

## 🔐 Segurança

### Sempre validar permissões

```typescript
async function canEditItem(userId: string, itemId: string) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      shares: {
        where: { userId }
      }
    }
  });

  return (
    item?.createdById === userId ||
    item?.shares.some(s => ['edit', 'admin'].includes(s.permission))
  );
}
```

---

## 🚀 Migração para PostgreSQL

Quando crescer, migrar é fácil:

1. Mudar `datasource` no `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Atualizar `.env`:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/galaxy_notes"
```

3. Rodar migrations:
```bash
npx prisma migrate dev
```

Prisma cuida das diferenças de SQL!

---

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [SQLite Docs](https://sqlite.org/docs.html)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

## 🆘 Troubleshooting

### Erro "No Prisma Client"
```bash
npx prisma generate
```

### Banco corrompido
```bash
rm prisma/dev.db
npx prisma migrate dev
```

### Ver queries executadas
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});
```

---

**Feito com 💙 para o Galaxy Notes**