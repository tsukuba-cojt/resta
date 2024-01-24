import { useCallback, useContext, useRef } from 'react';
import { PropsContext } from '../contexts/PropsContext';
import { setFormatsAndPushToAry } from '../features/formatter';
import { StyleRule } from '../features/style_sheet';
import { ElementSelectionContext } from '../contexts/ElementSelectionContext';
import { getCssSelector } from '../utils/CSSUtils';

type ReturnType = {
  /**
   * スタイルを適用する
   * @param keyOrArray CSSキーまたはCSSキーと値の配列
   * @param value （第一引数にCSSキーを指定した場合）CSSキーに対応する値
   */
  applyStyle: (
    keyOrArray: string | [key: string, value: string | number][],
    value?: string | number,
  ) => void;
};

export default function useStyleApplier(): ReturnType {
  const propsContext = useContext(PropsContext);
  const elementContext = useContext(ElementSelectionContext);

  const previousCssKey = useRef('');
  const previousId = useRef(Math.random() * 10000);

  const debounce = (func: VoidFunction, wait = 1000) => {
    let timerId: NodeJS.Timeout;
    return (...args: []) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func.apply(null, args);
      }, wait);
    };
  };

  const applyStyle = useCallback(
    (
      keyOrArray: string | [key: string, value: string | number][],
      value: string | number | undefined,
    ) => {
      debounce(() => {
        if (elementContext.selectedElement == null) {
          return;
        }

        const keyString = Array.isArray(keyOrArray)
          ? keyOrArray.map(([key, _]) => `${key}`).join(';')
          : keyOrArray;
        const id =
          previousCssKey.current === keyString
            ? previousId.current
            : Math.floor(Math.random() * 10000);

        let rules: StyleRule[];
        if (Array.isArray(keyOrArray)) {
          rules = keyOrArray.map(([key, value]) => {
            return {
              id,
              cssSelector:
                getCssSelector(
                  elementContext.selectElementBy,
                  elementContext.selectedElement,
                ) + elementContext.selectedPseudoClass,
              values: [
                {
                  key,
                  value: `${value}`,
                },
              ],
            };
          });
        } else {
          rules = [
            {
              id,
              cssSelector:
                getCssSelector(
                  elementContext.selectElementBy,
                  elementContext.selectedElement,
                ) + elementContext.selectedPseudoClass,
              values: [
                {
                  key: keyOrArray,
                  value: value != null ? `${value}` : 'unset',
                },
              ],
            },
          ];
        }

        setFormatsAndPushToAry(rules, propsContext);

        previousCssKey.current = keyString;
        previousId.current = id;

        elementContext.overlayElements.forEach((overlay) => {
          const rect = overlay.element.getBoundingClientRect();
          overlay.overlayElement.style.top = `${rect.top}px`;
          overlay.overlayElement.style.left = `${rect.left}px`;
          overlay.overlayElement.style.width = `${rect.width}px`;
          overlay.overlayElement.style.height = `${rect.height}px`;
        });
      }, 500)();
    },
    [elementContext.selectedElement, propsContext],
  );

  return {
    applyStyle,
  };
}
