'use client';

import { useApp } from '@/contexts/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentEditor } from '@/components/editor/DocumentEditor';
import { Welcome } from '@/components/Welcome';

export default function Home() {
  const { state } = useApp();
  
  return (
    <AppLayout>
      {state.currentDocumentId ? (
        <DocumentEditor 
          documentId={state.currentDocumentId} 
        />
      ) : (
        <Welcome />
      )}
    </AppLayout>
  );
}