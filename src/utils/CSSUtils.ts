export const kebabToCamel = (text: string): string => {
  const split = text.split('-');
  let result = split[0];

  if (split.length == 1) {
    return result;
  }

  for (let i = 1; i < split.length; i++) {
    result += split[i].toUpperCase()[0] + split[i].substring(1);
  }
  return result;
};

/**
 * 指定された要素のルート要素からのCSSセレクタを取得する
 * @param element
 */
export const getAbsoluteCSSSelector = (element: HTMLElement): string => {
  let result = '';
  const visit = (e: HTMLElement | null) => {
    if (e == null) return;
    result = `${createSelector(e)} > ${result}`;
    visit(e.parentElement);
  };

  result = element.tagName.toLowerCase();
  visit(element.parentElement);

  return result;
};

const createSelector = (element: HTMLElement): string => {
  const tag = element.tagName.toLowerCase();

  if (element.getAttribute('id')) {
    return `#${element.getAttribute('id')}`;
  }

  const returnWithAttr = (attrName: string): string => {
    return `${tag}[${attrName}*="${element.getAttribute(attrName)!.trim()}"]`;
  };

  if (element.getAttribute('href')) {
    return returnWithAttr('href');
  } else if (element.getAttribute('src')) {
    return returnWithAttr('src');
  } else if (element.getAttribute('class')) {
    return returnWithAttr('class');
  } else if (element.getAttribute('style')) {
    return returnWithAttr('style');
  }

  if (element.parentElement) {
    if (element.parentElement.childNodes.length === 1) {
      return tag;
    }

    const index = Array.from(element.parentElement.childNodes)
      .filter((node) => node.nodeName.toLowerCase() === tag)
      .indexOf(element);

    return index !== -1 ? `${tag}:nth-of-type(${index + 1})` : tag;
  }

  return tag;
};

export const rgbToHexColor = (rgb: number[]) => {
  return `#${rgb.map((v) => ('00' + v.toString(16)).slice(-2)).join('')}`;
};
