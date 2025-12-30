// ============================================
// TIPOS UTILITÁRIOS PARA BANCO DE DADOS
// ============================================

import { Prisma } from '../../generated/prisma';

// ============================================
// ENUMS
// ============================================

export enum ItemType {
  NOTE = 'note',
  LIST = 'list',
  BOARD = 'board',
  CALENDAR = 'calendar',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum TaskType {
  TASK = 'task',
  REMINDER = 'reminder',
  EVENT = 'event',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum Permission {
  VIEW = 'view',
  EDIT = 'edit',
  ADMIN = 'admin',
}

// ============================================
// METADATA TYPES (para campo JSON)
// ============================================

export interface BoardMetadata {
  columns: string[];
  color?: string;
  defaultStatus?: string;
}

export interface CalendarMetadata {
  defaultView?: 'day' | 'week' | 'month';
  workingHours?: {
    start: number;
    end: number;
  };
}

export interface NoteMetadata {
  format?: 'markdown' | 'rich-text';
  template?: string;
}

export type ItemMetadata = BoardMetadata | CalendarMetadata | NoteMetadata | null;

// ============================================
// INCLUDES ÚTEIS (queries pré-configuradas)
// ============================================

export const itemWithRelations = Prisma.validator<Prisma.ItemDefaultArgs>()({
  include: {
    workspace: true,
    createdBy: {
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    },
    tasks: {
      include: {
        subtasks: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    },
    tags: {
      include: {
        tag: true,
      },
    },
    shares: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    },
    comments: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    },
  },
});

export const taskWithRelations = Prisma.validator<Prisma.TaskDefaultArgs>()({
  include: {
    item: {
      select: {
        id: true,
        title: true,
        type: true,
      },
    },
    assignedTo: {
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    },
    createdBy: {
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    },
    subtasks: {
      orderBy: {
        position: 'asc',
      },
    },
  },
});

// ============================================
// TIPOS INFERIDOS
// ============================================

export type ItemWithRelations = Prisma.ItemGetPayload<typeof itemWithRelations>;
export type TaskWithRelations = Prisma.TaskGetPayload<typeof taskWithRelations>;

export type ItemSummary = Pick<
  Prisma.ItemGetPayload<{ include: { tasks: true } }>,
  'id' | 'type' | 'title' | 'isFavorite' | 'isArchived' | 'updatedAt'
> & {
  taskCount?: number;
  completedTaskCount?: number;
};

// ============================================
// FILTROS ÚTEIS
// ============================================

export const itemFilters = {
  active: { isArchived: false } as const,
  archived: { isArchived: true } as const,
  favorite: { isFavorite: true, isArchived: false } as const,

  byType: (type: ItemType) => ({ type, isArchived: false } as const),

  byWorkspace: (workspaceId: string) =>
    ({ workspaceId, isArchived: false } as const),

  ownedBy: (userId: string) =>
    ({ createdById: userId, isArchived: false } as const),

  sharedWith: (userId: string) => ({
    shares: {
      some: {
        userId,
      },
    },
    isArchived: false,
  } as const),

  accessibleBy: (userId: string) => ({
    OR: [
      { createdById: userId },
      {
        shares: {
          some: {
            userId,
          },
        },
      },
    ],
    isArchived: false,
  } as const),
};

export const taskFilters = {
  active: {
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  } as const,

  completed: { status: TaskStatus.DONE } as const,

  overdue: {
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    dueDate: { lt: new Date() },
  } as const,

  upcoming: (days: number = 7) => ({
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    dueDate: {
      gte: new Date(),
      lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    },
  } as const),

  byPriority: (priority: Priority) => ({
    priority,
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  } as const),

  assignedTo: (userId: string) => ({
    assignedToId: userId,
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  } as const),
};

// ============================================
// HELPERS DE PERMISSÃO
// ============================================

export interface PermissionCheck {
  canView: boolean;
  canEdit: boolean;
  canAdmin: boolean;
  isOwner: boolean;
}

export function checkPermission(
  item: { createdById: string; shares?: Array<{ userId: string; permission: string }> },
  userId: string
): PermissionCheck {
  const isOwner = item.createdById === userId;

  if (isOwner) {
    return {
      canView: true,
      canEdit: true,
      canAdmin: true,
      isOwner: true,
    };
  }

  const share = item.shares?.find(s => s.userId === userId);

  if (!share) {
    return {
      canView: false,
      canEdit: false,
      canAdmin: false,
      isOwner: false,
    };
  }

  return {
    canView: true,
    canEdit: [Permission.EDIT, Permission.ADMIN].includes(share.permission as Permission),
    canAdmin: share.permission === Permission.ADMIN,
    isOwner: false,
  };
}

// ============================================
// HELPERS DE ORDENAÇÃO
// ============================================

export const orderBy = {
  items: {
    recent: { updatedAt: 'desc' } as const,
    oldest: { updatedAt: 'asc' } as const,
    alphabetical: { title: 'asc' } as const,
    position: { position: 'asc' } as const,
  },

  tasks: {
    priority: [
      { priority: 'asc' },
      { position: 'asc' },
    ] as const,
    dueDate: { dueDate: 'asc' } as const,
    recent: { createdAt: 'desc' } as const,
    position: { position: 'asc' } as const,
  },
};

// ============================================
// VALIDAÇÃO DE METADATA
// ============================================

export function parseBoardMetadata(metadata: string | null): BoardMetadata | null {
  if (!metadata) return null;

  try {
    const parsed = JSON.parse(metadata);
    return {
      columns: parsed.columns || ['todo', 'in_progress', 'done'],
      color: parsed.color,
      defaultStatus: parsed.defaultStatus || 'todo',
    };
  } catch {
    return null;
  }
}

export function parseCalendarMetadata(metadata: string | null): CalendarMetadata | null {
  if (!metadata) return null;

  try {
    const parsed = JSON.parse(metadata);
    return {
      defaultView: parsed.defaultView || 'week',
      workingHours: parsed.workingHours,
    };
  } catch {
    return null;
  }
}

// ============================================
// ESTATÍSTICAS
// ============================================

export interface TaskStatistics {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  cancelled: number;
  overdue: number;
  completionRate: number;
}

export interface ItemStatistics {
  totalItems: number;
  notes: number;
  lists: number;
  boards: number;
  calendars: number;
  favorites: number;
  shared: number;
}

// ============================================
// BUSCA E PAGINAÇÃO
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function calculatePagination(
  total: number,
  page: number = 1,
  limit: number = 20
): PaginatedResponse<never>['pagination'] {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export interface SearchParams {
  query: string;
  type?: ItemType;
  workspaceId?: string;
  tags?: string[];
  onlyFavorites?: boolean;
}

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface CreateItemDTO {
  workspaceId: string;
  type: ItemType;
  title: string;
  content?: string;
  metadata?: ItemMetadata;
  parentId?: string;
  tags?: string[];
}

export interface UpdateItemDTO {
  title?: string;
  content?: string;
  metadata?: ItemMetadata;
  position?: number;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface CreateTaskDTO {
  itemId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  type?: TaskType;
  priority?: Priority;
  position?: number;
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  assignedToId?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  position?: number;
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  assignedToId?: string;
  completedAt?: Date;
}

export interface ShareItemDTO {
  itemId: string;
  userId: string;
  permission: Permission;
}

export interface CreateCommentDTO {
  itemId: string;
  content: string;
}

// ============================================
// CONSTANTES
// ============================================

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const;

export const MAX_TITLE_LENGTH = 200;
export const MAX_CONTENT_LENGTH = 1000000; // 1MB
export const MAX_TAGS_PER_ITEM = 10;
export const MAX_SHARES_PER_ITEM = 50;

// ============================================
// VALIDATORS
// ============================================

export function isValidItemType(type: string): type is ItemType {
  return Object.values(ItemType).includes(type as ItemType);
}

export function isValidTaskStatus(status: string): status is TaskStatus {
  return Object.values(TaskStatus).includes(status as TaskStatus);
}

export function isValidPriority(priority: string): priority is Priority {
  return Object.values(Priority).includes(priority as Priority);
}

export function isValidPermission(permission: string): permission is Permission {
  return Object.values(Permission).includes(permission as Permission);
}
