import { getDisplayFormat } from './prop';
import * as resta_console from './resta_console';

let styleSheet: CSSStyleSheet | null = null;
/**
 * CSSStyleSheetを取得する
 * シングルトンのような構造になっている
 */

export const getStyleSheet = () => {
  if (styleSheet == null) {
    const styleSheetElement = document.createElement('style');
    document.head.appendChild(styleSheetElement);
    styleSheet = styleSheetElement.sheet;
  }
  return styleSheet;
};

/**
 * CssSelectorとcssKeyの配列を渡すと、スタイルを適用する
 * valueはいらない
 */
export const setStyleRule = (styles: {
  cssSelector: string;
  keys: Array<string>;
}) => {
  if (!styles.keys || !styles.cssSelector) {
    resta_console.log('setStyleRule: invalid value');
    return;
  }
  const styleSheet = getStyleSheet();
  const canInsert = styleSheet?.insertRule;
  for (const key of styles.keys) {
    if (canInsert) {
      // もしcssSelectorに対応するルールがなければ空のルールを追加する
      for (let i = 0; i < styleSheet?.cssRules.length; i++) {
        const rule = styleSheet?.cssRules[i];
        if (rule instanceof CSSStyleRule) {
          if (rule.selectorText === styles.cssSelector) {
            const value = getDisplayFormat(styles.cssSelector, key);
            if (!value) {
              resta_console.error(
                'style_sheet.setStyleRule0: getDisplayFormat is false'
              );
              removeStyleRule(styles.cssSelector, key);
              continue;
            }
            if (rule.style.getPropertyValue(key) === value) continue;
            resta_console.log('setProperty');
            rule.style.setProperty(key, value);
            continue;
          }
        }
      }
      const value = getDisplayFormat(styles.cssSelector, key);
      if (!value) {
        resta_console.error(
          'style_sheet.setStyleRule1: getDisplayFormat is false'
        );
        removeStyleRule(styles.cssSelector, key);
        continue;
      }
      resta_console.log('insertRule');
      styleSheet?.insertRule(
        `${styles.cssSelector}{${key}:${value}}`,
        styleSheet.cssRules.length
      );
    } else {
      if (!styleSheet?.rules) {
        resta_console.log('setStyleRule(!canInsert): invalid value');
        return;
      }
      // もしcssSelectorに対応するルールがなければ空のルールを追加する
      for (let i = 0; i < styleSheet?.rules.length; i++) {
        const rule = styleSheet?.rules[i];
        if (
          rule instanceof CSSStyleRule &&
          rule.selectorText === styles.cssSelector
        ) {
          const value = getDisplayFormat(styles.cssSelector, key);
          if (!value) {
            resta_console.error(
              'style_sheet.setStyleRule2: getDisplayFormat is false'
            );
            removeStyleRule(styles.cssSelector, key);
            continue;
          }
          if (rule.style.getPropertyValue(key) === value) continue;
          rule.style.setProperty(key, value);
          continue;
        }
      }
      const value = getDisplayFormat(styles.cssSelector, key);
      if (!value) {
        resta_console.error(
          'style_sheet.setStyleRule3: getDisplayFormat is false'
        );
        removeStyleRule(styles.cssSelector, key);
        continue;
      }
      styleSheet?.addRule(
        styles.cssSelector,
        `${key}:${value}`,
        styleSheet.rules.length
      );
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
    if (rule instanceof CSSStyleRule) {
      if (rule.selectorText === cssSelector) {
        const removed = rule.style.removeProperty(cssKey);
        resta_console.log('removeStyleRule', cssSelector, cssKey);
        resta_console.log('removed value:', removed);
        resta_console.log('rule.style:', styleSheet.rules);
      }
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
