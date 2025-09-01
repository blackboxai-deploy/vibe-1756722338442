'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockRenderer } from './BlockRenderer';
import { AddBlockButton } from './AddBlockButton';
import { Document, Block } from '@/types';
import { generateId } from '@/lib/utils';

interface DocumentEditorProps {
  documentId: string;
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const { state, dispatch } = useApp();
  
  const document = state.documents.find((doc: Document) => doc.id === documentId);
  
  if (!document) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Document not found
      </div>
    );
  }
  
  const addBlock = (index: number, type: Block['type'] = 'paragraph') => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: '',
      properties: {},
    };
    
    dispatch({
      type: 'ADD_BLOCK',
      payload: {
        documentId,
        index,
        block: newBlock,
      },
    });
  };
  
  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    dispatch({
      type: 'UPDATE_BLOCK',
      payload: {
        documentId,
        blockId,
        updates,
      },
    });
  };
  
  const deleteBlock = (blockId: string) => {
    // Don't allow deleting the last block
    if (document.blocks.length <= 1) return;
    
    dispatch({
      type: 'DELETE_BLOCK',
      payload: {
        documentId,
        blockId,
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Document Cover */}
      {document.cover && (
        <div 
          className="h-60 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${document.cover})` }}
        />
      )}
      
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-8">
          {/* Document Title Section */}
          <div className="mb-8">
            {document.emoji && (
              <div className="text-6xl mb-4">
                {document.emoji}
              </div>
            )}
          </div>
          
          {/* Blocks */}
          <div className="space-y-1">
            {document.blocks.map((block: Block, index: number) => (
              <div key={block.id} className="group relative">
                {/* Add Block Button (appears on hover) */}
                <div className="absolute -left-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AddBlockButton
                    onAddBlock={(type) => addBlock(index, type)}
                    size="sm"
                  />
                </div>
                
                {/* Block Content */}
                <BlockRenderer
                  block={block}
                  onUpdate={(updates) => updateBlock(block.id, updates)}
                  onDelete={() => deleteBlock(block.id)}
                  onEnter={() => addBlock(index + 1)}
                  isSelected={state.selectedBlockId === block.id}
                />
              </div>
            ))}
            
            {/* Add Block at End */}
            <div className="pt-4">
              <AddBlockButton
                onAddBlock={(type) => addBlock(document.blocks.length, type)}
                placeholder="Type '/' for commands"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}