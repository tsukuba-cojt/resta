import React, { useContext, useLayoutEffect } from 'react';
import { CONTAINER_ID } from './root_manager';
import { ElementSelectionContext } from '../contexts/ElementSelectionContext';

const ElementSelector = () => {
  const HOVERED_BACKGROUND_COLOR = '#64B5F680';
  /*
    const SELECTED_PADDING_COLOR = '#FF000080';
    const SELECTED_BACKGROUND_COLOR = '#00FF0080';
    const SELECTED_COLOR = 'rgba(255, 0, 0, 0.4)';
     */

  const elementSelection = useContext(ElementSelectionContext);

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
        !element!.closest('#resta-root') &&
        !element!.closest('.ant-select-dropdown') &&
        !element!.closest('.ant-popover')
      ) {
        elementSelection.setHoveredElement(element);

        const previousBackgroundColor = element.style.backgroundColor;
        element.style.backgroundColor = HOVERED_BACKGROUND_COLOR;
        element.addEventListener(
          'mouseout',
          () => (element.style.backgroundColor = previousBackgroundColor),
          { once: true }
        );

        const clickListener = (ev: MouseEvent) => {
          const newElement = ev.target as HTMLElement;
          if (
            !newElement.closest('#resta-root') &&
            !newElement.closest('.ant-select-dropdown') &&
            !element!.closest('.ant-popover')
          ) {
            if (ev.shiftKey) {
              ev.preventDefault();
            }
            elementSelection.selectedElement?.removeEventListener(
              'click',
              clickListener
            );
          }
        };

        const listener = (ev: MouseEvent) => {
          const newElement = ev.target as HTMLElement;
          if (
            !newElement.closest('#resta-root') &&
            !newElement.closest('.ant-select-dropdown') &&
            !element!.closest('.ant-popover')
          ) {
            elementSelection.selectedElement?.removeEventListener(
              'mousedown',
              listener
            );
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

  /*
    現状クリック時に色を変えることがバグの温床となっているので無効化
    useEffect(() => {
        if (selectedElement) {
            const previousBorder = selectedElement.style.border;
            const previousBackgroundImage = selectedElement.style.backgroundImage;
            const previousBackgroundClip = selectedElement.style.backgroundClip;

            if (selectedElement.tagName === "IMG") {
                selectedElement.style.border = `2px solid ${SELECTED_COLOR}`;

            } else {
                selectedElement.style.backgroundImage = `linear-gradient(to bottom, ${SELECTED_PADDING_COLOR} 0%, ${SELECTED_PADDING_COLOR} 100%), linear-gradient(to bottom, ${SELECTED_BACKGROUND_COLOR} 0%, ${SELECTED_BACKGROUND_COLOR} 100%)`;
                selectedElement.style.backgroundClip = 'content-box, padding-box';
            }
        }
    }, [selectedElement]);

     */

  return <></>;
};

export default ElementSelector;
