-- ============================================
-- QUERIES ÚTEIS PARA GALAXY NOTES (SQLite)
-- ============================================

-- ============================================
-- 1. BUSCA E FILTROS
-- ============================================

-- Buscar todas as notas de um usuário com full-text search
SELECT i.*, w.name as workspace_name
FROM items i
JOIN workspaces w ON i.workspaceId = w.id
WHERE i.createdById = 'user_id'
  AND i.type = 'note'
  AND i.isArchived = 0
  AND (i.title LIKE '%busca%' OR i.content LIKE '%busca%')
ORDER BY i.updatedAt DESC;

-- Buscar itens compartilhados com um usuário
SELECT i.*, s.permission, u.name as shared_by
FROM items i
JOIN shares s ON i.id = s.itemId
JOIN users u ON s.createdById = u.id
WHERE s.userId = 'user_id'
  AND i.isArchived = 0
ORDER BY i.updatedAt DESC;

-- Buscar tarefas pendentes com prazo próximo (próximos 7 dias)
SELECT t.*, i.title as item_title
FROM tasks t
JOIN items i ON t.itemId = i.id
WHERE t.assignedToId = 'user_id'
  AND t.status IN ('todo', 'in_progress')
  AND t.dueDate IS NOT NULL
  AND t.dueDate <= datetime('now', '+7 days')
ORDER BY t.dueDate ASC;

-- Buscar itens por tags
SELECT i.*, GROUP_CONCAT(t.name, ', ') as tags
FROM items i
JOIN item_tags it ON i.id = it.itemId
JOIN tags t ON it.tagId = t.id
WHERE t.name IN ('importante', 'urgente')
  AND i.isArchived = 0
GROUP BY i.id
ORDER BY i.updatedAt DESC;

-- ============================================
-- 2. ESTATÍSTICAS E DASHBOARDS
-- ============================================

-- Contagem de tarefas por status em um quadro kanban
SELECT status, COUNT(*) as count
FROM tasks
WHERE itemId = 'board_id'
GROUP BY status
ORDER BY
  CASE status
    WHEN 'todo' THEN 1
    WHEN 'in_progress' THEN 2
    WHEN 'done' THEN 3
    ELSE 4
  END;

-- Progresso geral de tarefas de um usuário
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN status IN ('todo', 'in_progress') THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN dueDate < datetime('now') AND status != 'done' THEN 1 ELSE 0 END) as overdue,
  ROUND(CAST(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) * 100, 2) as completion_percentage
FROM tasks
WHERE createdById = 'user_id';

-- Tarefas agrupadas por prioridade
SELECT
  priority,
  COUNT(*) as count,
  SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed
FROM tasks
WHERE createdById = 'user_id'
  AND status != 'cancelled'
GROUP BY priority
ORDER BY
  CASE priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
    ELSE 5
  END;

-- ============================================
-- 3. HIERARQUIA E NAVEGAÇÃO
-- ============================================

-- Buscar item com seus filhos (um nível)
SELECT
  i.id, i.title, i.type, i.parentId,
  (SELECT COUNT(*) FROM items WHERE parentId = i.id) as children_count
FROM items i
WHERE i.id = 'item_id' OR i.parentId = 'item_id'
ORDER BY i.parentId NULLS FIRST, i.position ASC;

-- Caminho completo de um item (breadcrumbs) - recursivo
WITH RECURSIVE item_path AS (
  SELECT id, title, parentId, 0 as level
  FROM items
  WHERE id = 'item_id'

  UNION ALL

  SELECT i.id, i.title, i.parentId, ip.level + 1
  FROM items i
  JOIN item_path ip ON i.id = ip.parentId
)
SELECT * FROM item_path
ORDER BY level DESC;

-- ============================================
-- 4. COLABORAÇÃO E PERMISSÕES
-- ============================================

-- Verificar se usuário tem permissão em um item
SELECT
  CASE
    WHEN i.createdById = 'user_id' THEN 'owner'
    WHEN s.permission IS NOT NULL THEN s.permission
    ELSE NULL
  END as user_permission
FROM items i
LEFT JOIN shares s ON i.id = s.itemId AND s.userId = 'user_id'
WHERE i.id = 'item_id';

-- Listar todos os colaboradores de um item
SELECT
  u.id, u.name, u.email, u.avatar,
  s.permission,
  s.createdAt as shared_at
FROM shares s
JOIN users u ON s.userId = u.id
WHERE s.itemId = 'item_id'
ORDER BY s.createdAt DESC;

-- ============================================
-- 5. AGENDA E CALENDÁRIO
-- ============================================

-- Eventos de um dia específico
SELECT t.*, i.title as calendar_title
FROM tasks t
JOIN items i ON t.itemId = i.id
WHERE i.type = 'calendar'
  AND t.type IN ('event', 'reminder')
  AND date(t.startTime) = '2024-01-15'
ORDER BY t.startTime ASC;

-- Visão semanal do calendário
SELECT
  date(t.startTime) as event_date,
  COUNT(*) as events_count
FROM tasks t
JOIN items i ON t.itemId = i.id
WHERE i.type = 'calendar'
  AND t.type IN ('event', 'reminder')
  AND t.startTime BETWEEN datetime('now', 'weekday 0', '-7 days')
                      AND datetime('now', 'weekday 0')
GROUP BY date(t.startTime)
ORDER BY event_date ASC;

-- Próximos lembretes
SELECT t.*, i.title as item_title
FROM tasks t
JOIN items i ON t.itemId = i.id
WHERE t.type = 'reminder'
  AND t.startTime > datetime('now')
ORDER BY t.startTime ASC
LIMIT 10;

-- ============================================
-- 6. LIMPEZA E MANUTENÇÃO
-- ============================================

-- Arquivar itens antigos não modificados (mais de 6 meses)
UPDATE items
SET isArchived = 1
WHERE updatedAt < datetime('now', '-6 months')
  AND isArchived = 0
  AND isFavorite = 0;

-- Deletar itens arquivados há muito tempo (mais de 1 ano)
DELETE FROM items
WHERE isArchived = 1
  AND updatedAt < datetime('now', '-1 year');

-- Limpar tarefas completadas antigas
DELETE FROM tasks
WHERE status = 'done'
  AND completedAt < datetime('now', '-3 months');

-- ============================================
-- 7. ANÁLISES E INSIGHTS
-- ============================================

-- Itens mais ativos (por número de comentários)
SELECT
  i.id, i.title, i.type,
  COUNT(c.id) as comment_count
FROM items i
LEFT JOIN comments c ON i.id = c.itemId
WHERE i.isArchived = 0
GROUP BY i.id
HAVING comment_count > 0
ORDER BY comment_count DESC
LIMIT 10;

-- Tags mais usadas
SELECT
  t.name, t.color,
  COUNT(it.itemId) as usage_count
FROM tags t
JOIN item_tags it ON t.id = it.tagId
JOIN items i ON it.itemId = i.id
WHERE i.isArchived = 0
GROUP BY t.id
ORDER BY usage_count DESC;

-- Atividade do usuário (últimos 30 dias)
SELECT
  date(createdAt) as activity_date,
  COUNT(*) as items_created
FROM items
WHERE createdById = 'user_id'
  AND createdAt > datetime('now', '-30 days')
GROUP BY date(createdAt)
ORDER BY activity_date DESC;

-- ============================================
-- 8. QUERIES PARA QUADRO KANBAN
-- ============================================

-- Buscar todas as tarefas de um board com subtasks
SELECT
  t.*,
  (SELECT COUNT(*) FROM subtasks WHERE taskId = t.id) as subtasks_total,
  (SELECT COUNT(*) FROM subtasks WHERE taskId = t.id AND isCompleted = 1) as subtasks_completed,
  u.name as assigned_to_name
FROM tasks t
LEFT JOIN users u ON t.assignedToId = u.id
WHERE t.itemId = 'board_id'
ORDER BY
  CASE t.status
    WHEN 'todo' THEN 1
    WHEN 'in_progress' THEN 2
    WHEN 'done' THEN 3
    ELSE 4
  END,
  t.position ASC;

-- Reordenar tarefa em uma coluna do kanban
UPDATE tasks
SET position = new_position, status = 'new_status'
WHERE id = 'task_id';

-- Ajustar posições após mover tarefa
UPDATE tasks
SET position = position + 1
WHERE itemId = 'board_id'
  AND status = 'target_status'
  AND position >= target_position
  AND id != 'moved_task_id';

-- ============================================
-- 9. ÍNDICES RECOMENDADOS (para performance)
-- ============================================

-- Já estão definidos no schema Prisma, mas caso precise adicionar manualmente:

-- CREATE INDEX idx_items_workspace ON items(workspaceId);
-- CREATE INDEX idx_items_type ON items(type);
-- CREATE INDEX idx_items_parent ON items(parentId);
-- CREATE INDEX idx_tasks_item ON tasks(itemId);
-- CREATE INDEX idx_tasks_status ON tasks(status);
-- CREATE INDEX idx_tasks_due_date ON tasks(dueDate);
-- CREATE INDEX idx_shares_user ON shares(userId);
-- CREATE INDEX idx_comments_item ON comments(itemId);

-- ============================================
-- 10. TRIGGERS ÚTEIS
-- ============================================

-- Atualizar updatedAt automaticamente ao modificar item
CREATE TRIGGER update_item_timestamp
AFTER UPDATE ON items
FOR EACH ROW
BEGIN
  UPDATE items SET updatedAt = datetime('now')
  WHERE id = NEW.id;
END;

-- Completar tarefa automaticamente quando todas as subtasks forem concluídas
CREATE TRIGGER check_task_completion
AFTER UPDATE ON subtasks
FOR EACH ROW
WHEN NEW.isCompleted = 1
BEGIN
  UPDATE tasks
  SET
    status = 'done',
    completedAt = datetime('now')
  WHERE id = NEW.taskId
    AND NOT EXISTS (
      SELECT 1 FROM subtasks
      WHERE taskId = NEW.taskId
      AND isCompleted = 0
    )
    AND status != 'done';
END;

-- Impedir compartilhamento duplicado
CREATE TRIGGER prevent_duplicate_share
BEFORE INSERT ON shares
FOR EACH ROW
WHEN EXISTS (
  SELECT 1 FROM shares
  WHERE itemId = NEW.itemId
  AND userId = NEW.userId
)
BEGIN
  SELECT RAISE(ABORT, 'Share already exists');
END;
