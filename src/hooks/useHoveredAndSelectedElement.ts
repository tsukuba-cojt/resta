import { useLayoutEffect, useState } from 'react';

const useHoveredAndSelectedElement = (): [
  HTMLElement | null,
  HTMLElement | null
] => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );

  useLayoutEffect(() => {
    const updateElement = (event: MouseEvent) => {
      const element = event.target as HTMLElement | null;

      if (!element) {
        return;
      }

      if (
        element !== hoveredElement &&
        !element!.closest('#resta-root') &&
        !element!.closest('.ant-select-dropdown')
      ) {
        setHoveredElement(element);
        const listener = (ev: MouseEvent) => {
          const newElement = ev.target as HTMLElement;
          if (
            !newElement.closest('#resta-root') &&
            !newElement.closest('.ant-select-dropdown')
          ) {
            setSelectedElement((prev) => {
              prev?.removeEventListener('mousedown', listener);
              return newElement;
            });
          }
        };

        element.addEventListener('mousedown', listener);
      }
    };

    document.addEventListener('mouseover', updateElement);

    return () => document.removeEventListener('mouseover', updateElement);
  }, []);

  return [hoveredElement, selectedElement];
};

export default useHoveredAndSelectedElement;
