export const kebabToCamel = (text: string): string => {
  const split = text.split('-');
  let result = split[0];

  if (split.length == 1) {
    return result;
  }

  for (let i = 1; i < split.length; i++) {
    result += split[1].toUpperCase()[0] + split[1].substring(1);
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
  }

  if (element.parentElement) {
    let i = 1;
    for (const node of Array.from(element.parentElement.childNodes)) {
      if (node == element) {
        return `${tag}:nth-of-type(${i})`;
      }
      i++;
    }
  }

  return tag;
};
