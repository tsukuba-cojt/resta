import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

type ElementSelectionContext = {
  hoveredElement: HTMLElement | null;
  setHoveredElement: (value: HTMLElement | null) => void;

  selectedElement: HTMLElement | null;
  setSelectedElement: (value: HTMLElement | null) => void;

  selectedPseudoClass: string;
  setSelectedPseudoClass: (value: string) => void;

  /**
   * 選択された要素の上にオーバーレイする四角い枠を表現するための要素
   * NOTE: 複数選択を見据えて配列にしてある
   */
  overlayElements: SelectedElement[];
  setOverlayElements: Dispatch<SetStateAction<SelectedElement[]>>;
};

export const defaultElementSelectionContext: ElementSelectionContext = {
  hoveredElement: null,
  setHoveredElement: (_) => {},
  selectedElement: null,
  setSelectedElement: (_) => {},
  selectedPseudoClass: '',
  setSelectedPseudoClass: (_) => {},
  overlayElements: [],
  setOverlayElements: () => undefined
};

export const ElementSelectionContext =
  React.createContext<ElementSelectionContext>(defaultElementSelectionContext);

export const useElementSelectionContext = (): ElementSelectionContext => {
  const [hoveredElement, _setHoveredElement] = useState<HTMLElement | null>(
    null,
  );
  const [selectedElement, _setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const [selectedPseudoClass, _setSelectedPseudoClass] = useState<string>('');
  const [overlayElements, _setOverlayElements] = useState<SelectedElement[]>([]);

  const setHoveredElement = useCallback((value: HTMLElement | null): void => {
    _setHoveredElement(value);
  }, []);

  const setSelectedElement = useCallback((value: HTMLElement | null): void => {
    _setSelectedElement(value);
  }, []);

  const setSelectedPseudoClass = useCallback((value: string): void => {
    _setSelectedPseudoClass(value);
  }, []);

  const setOverlayElements = useCallback((value: SelectedElement[] | ((prev: SelectedElement[]) => SelectedElement[])): void => {
    _setOverlayElements(value);
  }, []);

  return {
    hoveredElement,
    setHoveredElement,
    selectedElement,
    setSelectedElement,
    selectedPseudoClass,
    setSelectedPseudoClass,
    overlayElements,
    setOverlayElements,
  };
};
