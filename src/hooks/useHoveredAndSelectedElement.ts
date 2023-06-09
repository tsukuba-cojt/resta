import { useLayoutEffect, useState } from 'react';
import {CONTAINER_ID} from "../features/root_manager";

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
      if (!document.getElementById(CONTAINER_ID)) {
        document.removeEventListener('mouseover', updateElement);
      }

      const element = event.target as HTMLElement | null;

      if (!element) {
        return;
      }

      if (
        element !== hoveredElement &&
        !element!.closest('#resta-root') &&
        !element!.closest('.ant-select-dropdown') &&
        !element!.closest('.ant-popover')
      ) {
        setHoveredElement(element);
        const listener = (ev: MouseEvent) => {
          const newElement = ev.target as HTMLElement;
          if (
            !newElement.closest('#resta-root') &&
            !newElement.closest('.ant-select-dropdown') &&
            !element!.closest('.ant-popover')
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
