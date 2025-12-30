// Importar tipos do Prisma
import type {
  User as PrismaUser,
  Note as PrismaNote,
  List as PrismaList,
  Kanban as PrismaKanban,
  Card as PrismaCard,
  EventTask as PrismaEventTask,
} from '../../api/generated/prisma/client';

// ============================================
// DTOs (sem campos sensíveis)
// ============================================

export type UserDTO = Omit<PrismaUser, 'password'>;

export type NoteDTO = PrismaNote;
export type ListDTO = PrismaList;
export type KanbanDTO = PrismaKanban;
export type CardDTO = PrismaCard;
export type EventTaskDTO = PrismaEventTask;

// ============================================
// TIPOS DE COMPARTILHAMENTO
// ============================================

export type Permission = 'view' | 'edit';

export interface SharedUser {
  userId: string;
  permission: Permission;
}

// ============================================
// TIPOS DE CONTEÚDO (Slate, etc)
// ============================================

// Formato do content das Notes (Slate)
export interface SlateNode {
  type?: string;
  text?: string;
  children?: SlateNode[];
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  [key: string]: any;
}

export type SlateContent = SlateNode[];

// Formato do content das Lists
export interface ListTask {
  id: string;
  title: string;
  checked: boolean;
  //position: number;
}

export interface ListContent {
  tasks: ListTask[];
}

// Formato do content dos Cards
export interface CardContent {
  title: string;
  description?: string;
  content: string;
  //status: string; // 'todo', 'doing', 'done', etc
  //position: number;
  //priority?: 'low' | 'medium' | 'high';
  //assignedTo?: string;
}

// ============================================
// REQUESTS/RESPONSES DA API
// ============================================

// Auth
export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  user: UserDTO;
  token: string;
}

export interface RegisterRequest {
  email: string;
  login: string;
  password: string;
}

// Notes
export interface CreateNoteRequest {
  content: SlateContent;
}

export interface UpdateNoteRequest {
  content?: SlateContent;
  shared?: SharedUser[];
}

// Lists
export interface CreateListRequest {
  content: ListContent;
}

export interface UpdateListRequest {
  content?: ListContent;
  shared?: SharedUser[];
}

// Kanbans
export interface CreateKanbanRequest {
  title: string;
}

export interface UpdateKanbanRequest {
  title?: string;
  shared?: SharedUser[];
}

// Cards
export interface CreateCardRequest {
  kanbanId: string;
  content: CardContent;
}

export interface UpdateCardRequest {
  content?: CardContent;
}

// Events/Tasks
export interface CreateEventTaskRequest {
  title: string;
  date?: string; // ISO string
  dateInit?: string;
  dateEnd?: string;
  isTask: boolean;
  reminder?: string;
}

export interface UpdateEventTaskRequest {
  title?: string;
  date?: string;
  dateInit?: string;
  dateEnd?: string;
  reminder?: string;
  shared?: SharedUser[];
}
