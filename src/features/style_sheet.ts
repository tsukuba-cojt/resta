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

export const setStyleRule = (styles: StyleRule) => {
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
            return;
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
            return;
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

export const removeRule = (cssSelector: string) => {
  const styleSheet = getStyleSheet();
  if (!styleSheet) {
    return;
  }
  for (let i = 0; i < styleSheet?.cssRules.length; i++) {
    const rule = styleSheet?.cssRules[i];
    if (rule instanceof CSSStyleRule) {
      if (rule.selectorText === cssSelector) {
        styleSheet?.deleteRule(i);
        return;
      }
    }
  }
};

export type StyleRule = {
  cssSelector: string;
  values: Array<StyleValue>;
};

export type StyleValue = {
  key: string;
  value: string;
};
