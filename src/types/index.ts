export interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulleted-list' | 'numbered-list' | 'todo' | 'quote' | 'code' | 'image';
  content: string;
  properties?: {
    checked?: boolean;
    language?: string;
    level?: number;
  };
  children?: Block[];
}

export interface Document {
  id: string;
  title: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  emoji?: string;
  cover?: string;
}

export interface Workspace {
  documents: Document[];
  currentDocumentId: string | null;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  emoji: string;
  blocks: Block[];
  category: 'personal' | 'work' | 'education' | 'creative';
}

export type BlockType = Block['type'];

export interface AppState extends Workspace {
  searchQuery: string;
  commandPaletteOpen: boolean;
  selectedBlockId: string | null;
}

export interface AppAction {
  type: 'CREATE_DOCUMENT' | 'UPDATE_DOCUMENT' | 'DELETE_DOCUMENT' | 'SET_CURRENT_DOCUMENT' | 
        'ADD_BLOCK' | 'UPDATE_BLOCK' | 'DELETE_BLOCK' | 'MOVE_BLOCK' |
        'TOGGLE_SIDEBAR' | 'SET_THEME' | 'SET_SEARCH_QUERY' | 'TOGGLE_COMMAND_PALETTE' |
        'SET_SELECTED_BLOCK';
  payload?: any;
}