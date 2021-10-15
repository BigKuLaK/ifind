import React, { useEffect } from 'react';
import { ContextProvider } from 'react-sortly';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export const DragAndDropProvider = ({ children }) => (
  <DndProvider backend={HTML5Backend}>
    <ContextProvider>
      {children}
    </ContextProvider>
  </DndProvider>
);
