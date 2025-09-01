'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, Document } from '@/types';
import { generateId } from '@/lib/utils';

const initialState: AppState = {
  documents: [],
  currentDocumentId: null,
  sidebarCollapsed: false,
  theme: 'light',
  searchQuery: '',
  commandPaletteOpen: false,
  selectedBlockId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CREATE_DOCUMENT': {
      const newDoc: Document = {
        id: generateId(),
        title: action.payload.title || 'Untitled',
        blocks: action.payload.blocks || [{
          id: generateId(),
          type: 'paragraph',
          content: '',
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: action.payload.parentId,
        emoji: action.payload.emoji,
        cover: action.payload.cover,
      };
      return {
        ...state,
        documents: [...state.documents, newDoc],
        currentDocumentId: newDoc.id,
      };
    }

    case 'UPDATE_DOCUMENT': {
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id 
            ? { ...doc, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : doc
        ),
      };
    }

    case 'DELETE_DOCUMENT': {
      const filteredDocs = state.documents.filter(doc => doc.id !== action.payload.id);
      return {
        ...state,
        documents: filteredDocs,
        currentDocumentId: state.currentDocumentId === action.payload.id 
          ? (filteredDocs.length > 0 ? filteredDocs[0].id : null)
          : state.currentDocumentId,
      };
    }

    case 'SET_CURRENT_DOCUMENT': {
      return {
        ...state,
        currentDocumentId: action.payload.id,
      };
    }

    case 'ADD_BLOCK': {
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.documentId
            ? {
                ...doc,
                blocks: [
                  ...doc.blocks.slice(0, action.payload.index),
                  action.payload.block,
                  ...doc.blocks.slice(action.payload.index),
                ],
                updatedAt: new Date().toISOString(),
              }
            : doc
        ),
      };
    }

    case 'UPDATE_BLOCK': {
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.documentId
            ? {
                ...doc,
                blocks: doc.blocks.map(block =>
                  block.id === action.payload.blockId
                    ? { ...block, ...action.payload.updates }
                    : block
                ),
                updatedAt: new Date().toISOString(),
              }
            : doc
        ),
      };
    }

    case 'DELETE_BLOCK': {
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.documentId
            ? {
                ...doc,
                blocks: doc.blocks.filter(block => block.id !== action.payload.blockId),
                updatedAt: new Date().toISOString(),
              }
            : doc
        ),
      };
    }

    case 'TOGGLE_SIDEBAR': {
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    }

    case 'SET_THEME': {
      return {
        ...state,
        theme: action.payload.theme,
      };
    }

    case 'SET_SEARCH_QUERY': {
      return {
        ...state,
        searchQuery: action.payload.query,
      };
    }

    case 'TOGGLE_COMMAND_PALETTE': {
      return {
        ...state,
        commandPaletteOpen: !state.commandPaletteOpen,
      };
    }

    case 'SET_SELECTED_BLOCK': {
      return {
        ...state,
        selectedBlockId: action.payload.blockId,
      };
    }

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('notion-app-data');
        if (saved) {
          const parsedData = JSON.parse(saved);
          // Initialize with saved data
          dispatch({ type: 'UPDATE_DOCUMENT', payload: { documents: parsedData.documents } });
          if (parsedData.currentDocumentId) {
            dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: { id: parsedData.currentDocumentId } });
          }
          if (parsedData.theme) {
            dispatch({ type: 'SET_THEME', payload: { theme: parsedData.theme } });
          }
        } else {
          // Create welcome document if no data exists
          dispatch({
            type: 'CREATE_DOCUMENT',
            payload: {
              title: 'Welcome to Your Workspace',
              emoji: '👋',
              blocks: [
                {
                  id: generateId(),
                  type: 'heading1',
                  content: 'Welcome to Your Productivity Workspace',
                },
                {
                  id: generateId(),
                  type: 'paragraph',
                  content: 'This is your personal productivity app, similar to Notion. You can create documents, organize your thoughts, and manage your projects all in one place.',
                },
                {
                  id: generateId(),
                  type: 'heading2',
                  content: 'Getting Started',
                },
                {
                  id: generateId(),
                  type: 'bulleted-list',
                  content: 'Click the "+ New Page" button to create your first document',
                },
                {
                  id: generateId(),
                  type: 'bulleted-list',
                  content: 'Use different block types: headings, lists, quotes, code blocks',
                },
                {
                  id: generateId(),
                  type: 'bulleted-list',
                  content: 'Press Cmd+K (or Ctrl+K) to open the command palette',
                },
                {
                  id: generateId(),
                  type: 'quote',
                  content: 'Start typing "/" at the beginning of any line to see available block types',
                },
              ],
            },
          });
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && state.documents.length > 0) {
      try {
        const dataToSave = {
          documents: state.documents,
          currentDocumentId: state.currentDocumentId,
          theme: state.theme,
        };
        localStorage.setItem('notion-app-data', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    }
  }, [state.documents, state.currentDocumentId, state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}