var styleSheet: CSSStyleSheet | null = null;
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

export const setStyleRule = (styles: {
  cssSelector: string;
  values: Array<StyleValue>;
}) => {
  if (!styles.values || !styles.cssSelector) {
    console.log('setStyleRule: invalid value');
    return;
  }
  const styleSheet = getStyleSheet();
  const canInsert = styleSheet?.insertRule;
  for (const style of styles.values) {
    if (canInsert) {
      // もしcssSelectorに対応するルールがなければ空のルールを追加する
      for (let i = 0; i < styleSheet?.cssRules.length; i++) {
        const rule = styleSheet?.cssRules[i];
        if (rule instanceof CSSStyleRule) {
          if (rule.selectorText === styles.cssSelector) {
            rule.style.setProperty(style.key, style.value);
            continue;
          }
        }
      }
      styleSheet?.insertRule(
        `${styles.cssSelector}{${style.key}:${style.value}}`,
        styleSheet.cssRules.length
      );
    } else {
      if (!styleSheet?.rules) {
        console.log('setStyleRule(!canInsert): invalid value');
        return;
      }
      // もしcssSelectorに対応するルールがなければ空のルールを追加する
      for (let i = 0; i < styleSheet?.rules.length; i++) {
        const rule = styleSheet?.rules[i];
        if (rule instanceof CSSStyleRule) {
          if (rule.selectorText === styles.cssSelector) {
            rule.style.setProperty(style.key, style.value);
            continue;
          }
        }
      }
      styleSheet?.addRule(
        styles.cssSelector,
        `${style.key}:${style.value}`,
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
        rule.style.removeProperty(cssKey);
        return;
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
