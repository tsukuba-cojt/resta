import { Format, FormatBlockByURL, FormatStyleValue } from '../types/Format';
import { removeStyleRule, setStyleRule } from './style_sheet';

// 現在のURLを格納する変数
export let currentUrl: string;
export const setUrl = (url: string) => {
  const urlObj = new URL(url);
  currentUrl = urlObj.origin + urlObj.pathname;
  edittedUrl = currentUrl;
};

// スタイル変更編集中のURLを格納する変数
// tsukuba.mast.ac.jp/* などのワイルドカードを含むURLを格納することもできる
export let edittedUrl: string;
export const setEdittedUrl = (url: string) => {
  console.log('setEdittedUrl', url);
  edittedUrl = url;
};

export let formatsArray: Array<FormatBlockByURL> = [];
export const setFormatsAry = (ary: Array<FormatBlockByURL>) => {
  formatsArray = ary;
};
export const removeAllFormats = () => {
  formatsArray.splice(0, formatsArray.length);
  console.log('resetFormatsAry', formatsArray);
};

export const removeCurrentFormat = () => {
  const index = formatsArray.findIndex((x) => x.url === currentUrl);
  if (index !== -1) {
    formatsArray.splice(index, 1);
  }
};

export const getValue = (cssValues: Array<FormatStyleValue> | undefined) => {
  if (!cssValues || cssValues.length === 0) {
    return '';
  }
  return cssValues[cssValues.length - 1].cssValue || '';
};

export const sortFormats = () => {
  setFormatsAry(
    formatsArray
      .filter((e) => e.formats.length !== 0)
      .sort((e) => (e.url.match(/\//g) || []).length)
      .sort((e) => (e.url[e.url.length - 1] === '*' ? -1 : 1))
  );
};

/**
 * ワイルドカード→完全一致の順にソートし、cssSelectorとcssKeyに対応するスタイルを返す
 * 見つからない場合はfalseを返す
 */
export const getDisplayFormat = (
  cssSelector: string,
  cssKey: string
): string | false => {
  const format: (Format | undefined)[] = formatsArray
    .filter((e) => matchUrl(currentUrl, e.url))
    .map((e) => e.formats)
    .filter((e) => e !== undefined)
    .map((e) => e.find((e) => e.cssSelector === cssSelector))
    .filter((e) => e !== undefined)
    .filter((e) => e?.changes.find((l) => l.cssKey === cssKey));
  const value = format[format.length - 1]?.changes.find(
    (e) => e.cssKey === cssKey
  );
  if (!value || value.cssValues.length === 0) {
    return false;
  }
  console.log(
    'getDisplayFormat',
    value.cssValues[value.cssValues.length - 1].cssValue
  );
  return value.cssValues[value.cssValues.length - 1].cssValue;
};

export const updateFormat = (cssSelector: string, cssKey: string) => {
  const value = getDisplayFormat(cssSelector, cssKey);
  if (!value) {
    removeStyleRule(cssSelector, cssKey);
    return;
  }
  setStyleRule({
    cssSelector: cssSelector,
    keys: [cssKey],
  });
};

export const matchUrl = (url: string, matchUrl: string) => {
  if (!matchUrl || !url) {
    return false;
  }
  let hasWildcard = false;
  let compareUrl = '';
  // 最後の文字が*ならワイルドカードとして扱う
  if (matchUrl[matchUrl.length - 1] === '*') {
    hasWildcard = true;
    compareUrl = matchUrl.slice(0, -1);
  }
  if (hasWildcard) {
    return url === compareUrl || url.startsWith(compareUrl);
  } else {
    return url === matchUrl;
  }
};
