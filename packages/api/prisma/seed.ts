import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.comment.deleteMany();
  await prisma.itemTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.share.deleteMany();
  await prisma.item.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Dados anteriores removidos');

  // Criar usuários
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@galaxy.dev',
      name: 'Alice Silva',
      avatar: '👩‍🚀',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@galaxy.dev',
      name: 'Bob Santos',
      avatar: '👨‍💻',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'carol@galaxy.dev',
      name: 'Carol Oliveira',
      avatar: '👩‍💼',
    },
  });

  console.log('✅ Usuários criados');

  // Criar workspaces
  const workspace1 = await prisma.workspace.create({
    data: {
      name: 'Pessoal',
      description: 'Minhas notas e tarefas pessoais',
      color: '#FF6B6B',
      icon: '🏠',
      ownerId: user1.id,
    },
  });

  const workspace2 = await prisma.workspace.create({
    data: {
      name: 'Projeto Galaxy Notes',
      description: 'Desenvolvimento do app de anotações',
      color: '#4ECDC4',
      icon: '🚀',
      ownerId: user1.id,
    },
  });

  const workspace3 = await prisma.workspace.create({
    data: {
      name: 'Estudos',
      description: 'Materiais de estudo e aprendizado',
      color: '#95E1D3',
      icon: '📚',
      ownerId: user1.id,
    },
  });

  console.log('✅ Workspaces criados');

  // Criar tags
  const tagUrgente = await prisma.tag.create({
    data: { name: 'urgente', color: '#FF4757' },
  });

  const tagImportante = await prisma.tag.create({
    data: { name: 'importante', color: '#FFA502' },
  });

  const tagIdeia = await prisma.tag.create({
    data: { name: 'ideia', color: '#FFD93D' },
  });

  const tagBug = await prisma.tag.create({
    data: { name: 'bug', color: '#EE5A6F' },
  });

  const tagFeature = await prisma.tag.create({
    data: { name: 'feature', color: '#6BCB77' },
  });

  console.log('✅ Tags criadas');

  // ============================================
  // NOTAS
  // ============================================

  const note1 = await prisma.item.create({
    data: {
      workspaceId: workspace1.id,
      type: 'note',
      title: 'Ideias para o fim de semana',
      content: `# Planejamento do Fim de Semana

- Visitar o parque com a família
- Assistir aquele filme que estava querendo
- Fazer aquela receita nova
- Ler pelo menos 50 páginas do livro atual

*Lembrar de comprar os ingredientes na sexta!*`,
      position: 0,
      isFavorite: true,
      createdById: user1.id,
    },
  });

  const note2 = await prisma.item.create({
    data: {
      workspaceId: workspace2.id,
      type: 'note',
      title: 'Decisões de Arquitetura',
      content: `# Decisões Técnicas - Galaxy Notes

## Stack Escolhida
- **Backend**: Node.js + TypeScript
- **Database**: SQLite (dev) → PostgreSQL (prod)
- **ORM**: Prisma
- **Frontend**: React + Vite

## Por que SQLite?
Perfeito para desenvolvimento e aplicações pequenas/médias. Quando escalar, migrar para PostgreSQL é simples com Prisma.`,
      position: 0,
      createdById: user1.id,
    },
  });

  await prisma.itemTag.createMany({
    data: [
      { itemId: note2.id, tagId: tagImportante.id },
      { itemId: note2.id, tagId: tagFeature.id },
    ],
  });

  const note3 = await prisma.item.create({
    data: {
      workspaceId: workspace3.id,
      type: 'note',
      title: 'Anotações - TypeScript Avançado',
      content: `# TypeScript - Tipos Avançados

## Utility Types
- \`Partial<T>\`: Torna todas as propriedades opcionais
- \`Required<T>\`: Torna todas obrigatórias
- \`Pick<T, K>\`: Seleciona apenas algumas propriedades
- \`Omit<T, K>\`: Remove propriedades específicas

## Exemplo prático
\`\`\`typescript
type User = { id: string; name: string; email: string; };
type UserPreview = Pick<User, 'id' | 'name'>;
\`\`\``,
      position: 0,
      createdById: user1.id,
    },
  });

  console.log('✅ Notas criadas');

  // ============================================
  // LISTA DE TAREFAS
  // ============================================

  const lista1 = await prisma.item.create({
    data: {
      workspaceId: workspace1.id,
      type: 'list',
      title: 'Compras do Mercado',
      position: 1,
      createdById: user1.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        itemId: lista1.id,
        title: 'Frutas e verduras',
        status: 'done',
        type: 'task',
        position: 0,
        completedAt: new Date('2024-01-10'),
        createdById: user1.id,
      },
      {
        itemId: lista1.id,
        title: 'Leite e derivados',
        status: 'done',
        type: 'task',
        position: 1,
        completedAt: new Date('2024-01-10'),
        createdById: user1.id,
      },
      {
        itemId: lista1.id,
        title: 'Produtos de limpeza',
        status: 'todo',
        type: 'task',
        position: 2,
        createdById: user1.id,
      },
      {
        itemId: lista1.id,
        title: 'Snacks e bebidas',
        status: 'todo',
        type: 'task',
        position: 3,
        createdById: user1.id,
      },
    ],
  });

  console.log('✅ Lista de tarefas criada');

  // ============================================
  // QUADRO KANBAN
  // ============================================

  const board1 = await prisma.item.create({
    data: {
      workspaceId: workspace2.id,
      type: 'board',
      title: 'Sprint 1 - MVP',
      metadata: JSON.stringify({
        columns: ['todo', 'in_progress', 'review', 'done'],
        color: '#667EEA',
      }),
      position: 1,
      createdById: user1.id,
    },
  });

  const task1 = await prisma.task.create({
    data: {
      itemId: board1.id,
      title: 'Configurar estrutura do projeto',
      description: 'Setup inicial: monorepo, TypeScript, Prisma, etc.',
      status: 'done',
      type: 'task',
      priority: 'high',
      position: 0,
      completedAt: new Date('2024-01-08'),
      assignedToId: user1.id,
      createdById: user1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      itemId: board1.id,
      title: 'Implementar autenticação',
      description: 'Sistema de login com JWT e refresh tokens',
      status: 'in_progress',
      type: 'task',
      priority: 'high',
      position: 0,
      assignedToId: user2.id,
      createdById: user1.id,
      dueDate: new Date('2024-01-20'),
    },
  });

  await prisma.subtask.createMany({
    data: [
      {
        taskId: task2.id,
        title: 'Endpoint de registro',
        isCompleted: true,
        position: 0,
      },
      {
        taskId: task2.id,
        title: 'Endpoint de login',
        isCompleted: true,
        position: 1,
      },
      {
        taskId: task2.id,
        title: 'Middleware de autenticação',
        isCompleted: false,
        position: 2,
      },
      {
        taskId: task2.id,
        title: 'Refresh token',
        isCompleted: false,
        position: 3,
      },
    ],
  });

  const task3 = await prisma.task.create({
    data: {
      itemId: board1.id,
      title: 'Criar models do Prisma',
      description: 'Definir schema completo do banco de dados',
      status: 'done',
      type: 'task',
      priority: 'urgent',
      position: 1,
      completedAt: new Date('2024-01-09'),
      assignedToId: user1.id,
      createdById: user1.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      itemId: board1.id,
      title: 'Implementar CRUD de notas',
      description: 'Endpoints para criar, ler, atualizar e deletar notas',
      status: 'todo',
      type: 'task',
      priority: 'high',
      position: 0,
      assignedToId: user1.id,
      createdById: user1.id,
      dueDate: new Date('2024-01-18'),
    },
  });

  const task5 = await prisma.task.create({
    data: {
      itemId: board1.id,
      title: 'Sistema de compartilhamento',
      description: 'Permitir compartilhar notas com outros usuários',
      status: 'todo',
      type: 'task',
      priority: 'medium',
      position: 1,
      createdById: user1.id,
      dueDate: new Date('2024-01-25'),
    },
  });

  const task6 = await prisma.task.create({
    data: {
      itemId: board1.id,
      title: 'Interface do Kanban Board',
      description: 'Drag and drop, criação de cards, etc.',
      status: 'todo',
      type: 'task',
      priority: 'medium',
      position: 2,
      assignedToId: user3.id,
      createdById: user1.id,
      dueDate: new Date('2024-01-22'),
    },
  });

  await prisma.itemTag.createMany({
    data: [
      { itemId: board1.id, tagId: tagImportante.id },
      { itemId: board1.id, tagId: tagFeature.id },
    ],
  });

  console.log('✅ Quadro Kanban criado');

  // ============================================
  // CALENDÁRIO / AGENDA
  // ============================================

  const calendar1 = await prisma.item.create({
    data: {
      workspaceId: workspace1.id,
      type: 'calendar',
      title: 'Minha Agenda',
      position: 2,
      createdById: user1.id,
    },
  });

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.task.createMany({
    data: [
      {
        itemId: calendar1.id,
        title: 'Reunião de equipe',
        description: 'Daily standup',
        status: 'todo',
        type: 'event',
        startTime: new Date(tomorrow.setHours(9, 0, 0)),
        endTime: new Date(tomorrow.setHours(9, 30, 0)),
        position: 0,
        createdById: user1.id,
      },
      {
        itemId: calendar1.id,
        title: 'Dentista',
        type: 'event',
        status: 'todo',
        startTime: new Date(tomorrow.setHours(14, 0, 0)),
        endTime: new Date(tomorrow.setHours(15, 0, 0)),
        position: 1,
        createdById: user1.id,
      },
      {
        itemId: calendar1.id,
        title: 'Lembrar de ligar para a mãe',
        type: 'reminder',
        status: 'todo',
        startTime: new Date(tomorrow.setHours(18, 0, 0)),
        position: 2,
        createdById: user1.id,
      },
      {
        itemId: calendar1.id,
        title: 'Apresentação do projeto',
        description: 'Demo do Galaxy Notes para stakeholders',
        type: 'event',
        status: 'todo',
        priority: 'high',
        startTime: new Date(nextWeek.setHours(10, 0, 0)),
        endTime: new Date(nextWeek.setHours(11, 30, 0)),
        position: 3,
        createdById: user1.id,
      },
    ],
  });

  await prisma.itemTag.create({
    data: { itemId: calendar1.id, tagId: tagImportante.id },
  });

  console.log('✅ Calendário criado');

  // ============================================
  // COMPARTILHAMENTO
  // ============================================

  // Alice compartilha o board do projeto com Bob (editor) e Carol (visualizadora)
  await prisma.share.createMany({
    data: [
      {
        itemId: board1.id,
        userId: user2.id,
        permission: 'edit',
        createdById: user1.id,
      },
      {
        itemId: board1.id,
        userId: user3.id,
        permission: 'view',
        createdById: user1.id,
      },
    ],
  });

  // Alice compartilha nota de arquitetura com Bob
  await prisma.share.create({
    data: {
      itemId: note2.id,
      userId: user2.id,
      permission: 'edit',
      createdById: user1.id,
    },
  });

  console.log('✅ Compartilhamentos criados');

  // ============================================
  // COMENTÁRIOS
  // ============================================

  await prisma.comment.createMany({
    data: [
      {
        itemId: board1.id,
        userId: user2.id,
        content: 'Ótimo planejamento! Vou começar pela autenticação hoje.',
      },
      {
        itemId: board1.id,
        userId: user3.id,
        content: 'Preciso de acesso ao Figma para fazer a interface do Kanban.',
      },
      {
        itemId: note2.id,
        userId: user2.id,
        content: 'Concordo com a escolha do Prisma, facilita muito a migração depois.',
      },
    ],
  });

  console.log('✅ Comentários criados');

  // ============================================
  // HIERARQUIA (Nota com subpáginas)
  // ============================================

  const parentNote = await prisma.item.create({
    data: {
      workspaceId: workspace3.id,
      type: 'note',
      title: 'Curso de React',
      content: '# Índice do Curso\n\nVeja as páginas abaixo para cada módulo.',
      position: 1,
      createdById: user1.id,
    },
  });

  await prisma.item.createMany({
    data: [
      {
        workspaceId: workspace3.id,
        type: 'note',
        title: 'Módulo 1: Fundamentos',
        content: '# Fundamentos do React\n\n- Componentes\n- Props\n- State',
        parentId: parentNote.id,
        position: 0,
        createdById: user1.id,
      },
      {
        workspaceId: workspace3.id,
        type: 'note',
        title: 'Módulo 2: Hooks',
        content: '# Hooks do React\n\n- useState\n- useEffect\n- useContext',
        parentId: parentNote.id,
        position: 1,
        createdById: user1.id,
      },
      {
        workspaceId: workspace3.id,
        type: 'note',
        title: 'Módulo 3: Avançado',
        content: '# Tópicos Avançados\n\n- Custom Hooks\n- Performance\n- Patterns',
        parentId: parentNote.id,
        position: 2,
        createdById: user1.id,
      },
    ],
  });

  console.log('✅ Hierarquia de notas criada');

  // ============================================
  // RESUMO
  // ============================================

  const counts = {
    users: await prisma.user.count(),
    workspaces: await prisma.workspace.count(),
    items: await prisma.item.count(),
    tasks: await prisma.task.count(),
    subtasks: await prisma.subtask.count(),
    shares: await prisma.share.count(),
    comments: await prisma.comment.count(),
    tags: await prisma.tag.count(),
  };

  console.log('\n📊 Resumo do Seed:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`👥 Usuários: ${counts.users}`);
  console.log(`📁 Workspaces: ${counts.workspaces}`);
  console.log(`📄 Items: ${counts.items}`);
  console.log(`✅ Tarefas: ${counts.tasks}`);
  console.log(`📝 Subtarefas: ${counts.subtasks}`);
  console.log(`🤝 Compartilhamentos: ${counts.shares}`);
  console.log(`💬 Comentários: ${counts.comments}`);
  console.log(`🏷️  Tags: ${counts.tags}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
