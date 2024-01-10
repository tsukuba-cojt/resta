import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
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

  const overlayElements = useRef(elementSelection.overlayElements);
  const setOverlayElements = useRef(elementSelection.setOverlayElements);
  const hoveredElement = useRef(elementSelection.hoveredElement);
  const setHoveredElement = useRef(elementSelection.setHoveredElement);
  const selectedElement = useRef(elementSelection.selectedElement);
  const setSelectedElement = useRef(elementSelection.setSelectedElement);

  const ignores = [
    '#resta-root',
    '.ant-select-dropdown',
    '.ant-popover',
    '.ant-modal-root',
    '.resta-selected-element'
  ];

  const checkIgnores = (element: HTMLElement): boolean => {
    for (const ignore of ignores) {
      if (element.closest(ignore)) {
        return false;
      }
    }
    return true;
  };

  /**
   * ウィンドウサイズを変更したときに、オーバーレイしている要素の位置およびサイズを更新する
   */
  useEffect(() => {
    const listener = () => {
      overlayElements.current.forEach((element) => {
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const rect = element.element.getBoundingClientRect();
        const div = element.overlayElement;

        div.style.top = `${scrollY + rect.y}px`;
        div.style.left = `${scrollX + rect.x}px`;
        div.style.width = `${rect.width}px`;
        div.style.height = `${rect.height}px`;
      });
    }
    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
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
        element !== hoveredElement.current &&
        checkIgnores(element!)
      ) {
        setHoveredElement.current(element);

        const previousBackgroundColor = element.style.backgroundColor;
        element.style.backgroundColor = HOVERED_BACKGROUND_COLOR;
        element.addEventListener(
          'mouseout',
          () => (element.style.backgroundColor = previousBackgroundColor),
          { once: true },
        );

        const clickListener = (ev: MouseEvent) => {
          if (!isContainerActive) {
            selectedElement.current?.removeEventListener(
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
            selectedElement.current?.removeEventListener(
              'click',
              clickListener,
            );

            // 選択された要素を青い四角でオーバーレイする
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;
            const rect = newElement.getBoundingClientRect();
            const div = document.createElement('div');

            div.style.position = 'absolute';
            div.style.top = `${scrollY + rect.y}px`;
            div.style.left = `${scrollX + rect.x}px`;
            div.style.width = `${rect.width}px`;
            div.style.height = `${rect.height}px`;
            div.style.border = '1.5px solid blue';
            div.style.pointerEvents = 'none';
            div.setAttribute('class', 'resta-selected-element');

            setOverlayElements.current((prev) => {
              prev.forEach((element) => {
                document.body.removeChild(element.overlayElement);
              });
              return [{element: newElement, overlayElement: div}];
            });

            document.body.appendChild(div);
          }
        };

        const listener = (ev: MouseEvent) => {
          const newElement = ev.target as HTMLElement;
          if (checkIgnores(newElement!)) {
            selectedElement.current?.removeEventListener(
              'mousedown',
              listener,
            );
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            newElement.style.backgroundColor = previousBackgroundColor;
            setSelectedElement.current(newElement);
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
