// Exportar tudo
export * from './types';

// Constantes úteis
export const PERMISSIONS = {
  VIEW: 'view',
  EDIT: 'edit',
} as const;

export const CARD_STATUS = {
  TODO: 'todo',
  DOING: 'doing',
  DONE: 'done',
} as const;
