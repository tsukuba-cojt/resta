import React, { useCallback, useState } from 'react';

type ElementSelectionContext = {
  hoveredElement: HTMLElement | null;
  setHoveredElement: (value: HTMLElement | null) => void;

  selectedElement: HTMLElement | null;
  setSelectedElement: (value: HTMLElement | null) => void;
};

export const defaultElementSelectionContext: ElementSelectionContext = {
  hoveredElement: null,
  setHoveredElement: _ => {},
  selectedElement: null,
  setSelectedElement: _ => {}
};

export const ElementSelectionContext = React.createContext<ElementSelectionContext>(
  defaultElementSelectionContext
);

export const useElementSelectionContext = (): ElementSelectionContext => {
  const [hoveredElement, _setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElement, _setSelectedElement] = useState<HTMLElement | null>(null);

  const setHoveredElement = useCallback((value: HTMLElement | null): void => {
    _setHoveredElement(value);
  }, []);

  const setSelectedElement = useCallback((value: HTMLElement | null): void => {
    _setSelectedElement(value);
  }, []);

  return { hoveredElement, setHoveredElement, selectedElement, setSelectedElement };
};
