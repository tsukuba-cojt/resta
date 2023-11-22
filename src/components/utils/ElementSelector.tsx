import { useContext, useEffect, useLayoutEffect } from 'react';
import { CONTAINER_ID } from '../../features/root_manager';
import { ElementSelectionContext } from '../../contexts/ElementSelectionContext';
import { isContainerActive } from '../../index';

const ElementSelector = () => {
  const HOVERED_BACKGROUND_COLOR = '#64B5F680';
  /*
    const SELECTED_PADDING_COLOR = '#FF000080';
    const SELECTED_BACKGROUND_COLOR = '#00FF0080';
    const SELECTED_COLOR = 'rgba(255, 0, 0, 0.4)';
     */

  const elementSelection = useContext(ElementSelectionContext);
  const ignores = [
    '#resta-root',
    '.ant-select-dropdown',
    '.ant-popover',
    '.ant-modal-root',
    '#resta-selected-element'
  ];

  const checkIgnores = (element: HTMLElement): boolean => {
    for (const ignore of ignores) {
      if (element.closest(ignore)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {

  }, [elementSelection.overlayElements]);

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
        element !== elementSelection.hoveredElement &&
        checkIgnores(element!)
      ) {
        elementSelection.setHoveredElement(element);

        const previousBackgroundColor = element.style.backgroundColor;
        element.style.backgroundColor = HOVERED_BACKGROUND_COLOR;
        element.addEventListener(
          'mouseout',
          () => (element.style.backgroundColor = previousBackgroundColor),
          { once: true },
        );

        const clickListener = (ev: MouseEvent) => {
          if (!isContainerActive) {
            elementSelection.selectedElement?.removeEventListener(
              'click',
              clickListener,
            );
            return;
          }

          const newElement = ev.target as HTMLElement;
          if (!newElement.closest('#resta-root') && checkIgnores(newElement!)) {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation()
            elementSelection.selectedElement?.removeEventListener(
              'click',
              clickListener,
            );

            // 選択された要素を青い四角でオーバーレイする

            const rect = newElement.getBoundingClientRect();
            const div = document.createElement('div');
            div.id = 'resta-selected-element';
            div.style.position = 'absolute';
            div.style.top = `${rect.y}px`;
            div.style.left = `${rect.x}px`;
            div.style.width = `${rect.width}px`;
            div.style.height = `${rect.height}px`;
            div.style.border = '2px solid blue';
            div.style.pointerEvents = 'none';
            elementSelection.setOverlayElements((prev) => {
              prev.forEach((element) => document.body.removeChild(element));
              return [div];
            });

            document.body.appendChild(div);
          }
        };

        const listener = (ev: MouseEvent) => {
          const newElement = ev.target as HTMLElement;
          if (checkIgnores(newElement!)) {
            elementSelection.selectedElement?.removeEventListener(
              'mousedown',
              listener,
            );
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            newElement.style.backgroundColor = previousBackgroundColor;
            elementSelection.setSelectedElement(newElement);
          }
        };

        element.addEventListener('click', clickListener, { passive: false });
        element.addEventListener('mousedown', listener);
      }
    };

    document.addEventListener('mouseover', updateElement);

    return () => document.removeEventListener('mouseover', updateElement);
  }, []);

  return null;
};

export default ElementSelector;
