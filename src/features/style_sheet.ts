import { getDisplayedFormat } from './prop';
import * as resta_console from './resta_console';
import { IPropsContext } from '../contexts/PropsContext';

let styleSheet: CSSStyleSheet | null = null;
/**
 * CSSStyleSheetを取得する
 * シングルトンのような構造になっている
 */
export const getStyleSheet = () => {
  if (styleSheet === null) {
    const styleSheetElement = document.createElement('style');
    document.head.appendChild(styleSheetElement);
    styleSheet = styleSheetElement.sheet as CSSStyleSheet;
  }
  return styleSheet;
};

/**
 * CssSelectorとcssKeyの配列を渡すと、最新のスタイルを適用する
 * valueはいらない
 */
export const setStyleRule = (
  styles: {
    cssSelector: string;
    keys: Array<string>;
  },
  prop: IPropsContext,
) => {
  resta_console.log('setStyleRule', styles);
  if (!styles.keys || !styles.cssSelector) {
    resta_console.log('setStyleRule: invalid value');
    return;
  }
  const styleSheet = getStyleSheet();
  const formats = prop.formatsArray
    .map((e) => e.formats)
    .filter((e) => e !== undefined)
    .map((e) => e.find((e) => e.cssSelector === styles.cssSelector))
    .filter((e) => e !== undefined);

  if (!formats || formats.length === 0) {
    resta_console.error('style_sheet.setStyleRule: formats is empty');
    return;
  }
  for (const key of styles.keys) {
    const rule = Array.from(styleSheet?.cssRules).find(
      (e) => e instanceof CSSStyleRule && e.selectorText === styles.cssSelector,
    ) as CSSStyleRule | undefined;
    if (rule) {
      const value = getDisplayedFormat(formats, key);
      if (!value) {
        resta_console.error(
          'style_sheet.setStyleRule0: getDisplayFormat is false',
          formats,
          key,
        );
        removeStyleRule(styles.cssSelector, key);
        continue;
      }
      if (rule.style.getPropertyValue(key) === value) continue;
      resta_console.log('setProperty', key, value);
      rule.style.setProperty(key, value);
    } else {
      for (const key of styles.keys) {
        const value = getDisplayedFormat(formats, key);
        if (!value) {
          resta_console.error(
            'style_sheet.setStyleRule1: getDisplayFormat is false',
            formats,
            key,
          );
          removeStyleRule(styles.cssSelector, key);
          continue;
        }
        resta_console.log('insertRule', key, value);
        styleSheet?.insertRule(
          `${styles.cssSelector}{${key}:${value}}`,
          styleSheet.cssRules.length,
        );
      }
    }
  }
};

export const removeStyleRule = (cssSelector: string, cssKey: string) => {
  const styleSheet = getStyleSheet();
  if (!styleSheet) {
    return;
  }
  for (let i = 0; i < styleSheet?.cssRules.length; i++) {
    const rule = styleSheet?.cssRules[i];
    if (rule instanceof CSSStyleRule && rule.selectorText === cssSelector) {
      rule.style.removeProperty(cssKey);
    }
  }
};

export type StyleRule = {
  id: number | string;
  cssSelector: string;
  values: Array<StyleValue>;
};

export type StyleValue = {
  key: string;
  value: string;
};
