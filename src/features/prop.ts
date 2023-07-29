import { Format, FormatBlockByURL } from '../types/Format';
import { removeStyleRule, setStyleRule } from './style_sheet';
import * as resta_console from './resta_console';
import { CompressedStyle } from './style_compresser';

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
  resta_console.log('setEdittedUrl', url);
  edittedUrl = url;
};

export let formatsArray: Array<FormatBlockByURL> = [];
export const setFormatsAry = (ary: Array<FormatBlockByURL>) => {
  formatsArray = ary;
};
export const removeAllFormats = () => {
  formatsArray.splice(0, formatsArray.length);
  resta_console.log('resetFormatsAry', formatsArray);
};

export const removeCurrentFormat = () => {
  const index = formatsArray.findIndex((x) => x.url === currentUrl);
  if (index !== -1) {
    formatsArray.splice(index, 1);
  }
};

export const sortFormats = () => {
  setFormatsAry(
    formatsArray
      .filter((e) => e.formats.length !== 0)
      .sort(
        (e) =>
          (e.url.match(/\//g) || []).length &&
          (e.url[e.url.length - 1] === '*' ? -1 : 1),
      ),
  );
};

/**
 * ワイルドカード→完全一致の順にソートし、cssSelectorとcssKeyに対応するスタイルを返す
 * 見つからない場合はfalseを返す
 */
export const getDisplayFormat = (
  formatsArray: (Format | undefined)[],
  cssKey: string,
): string | false => {
  if (!formatsArray || formatsArray.length === 0) {
    return false;
  }
  const format: (Format | undefined)[] = formatsArray.filter(
    (e) => e?.changes.find((l) => l.cssKey === cssKey),
  );
  const value = format[format.length - 1]?.changes.find(
    (e) => e.cssKey === cssKey,
  );
  if (!value || value.cssValues.length === 0) {
    return false;
  }
  resta_console.log(
    'getDisplayFormat',
    value.cssValues[value.cssValues.length - 1].cssValue,
  );
  return value.cssValues[value.cssValues.length - 1].cssValue;
};

export const updateFormat = (cssSelector: string, cssKey: string) => {
  const value = getDisplayFormat(
    formatsArray
      .map((e) => e.formats)
      .filter((e) => e !== undefined)
      .map((e) => e.find((e) => e.cssSelector === cssSelector))
      .filter((e) => e !== undefined),
    cssKey,
  );
  if (!value) {
    removeStyleRule(cssSelector, cssKey);
    return;
  }
  setStyleRule({
    cssSelector: cssSelector,
    keys: [cssKey],
  });
};

export const matchUrl = (currentUrl: string, matchUrl: string) => {
  if (!matchUrl || !currentUrl) {
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
    return currentUrl === compareUrl || currentUrl.startsWith(compareUrl);
  } else {
    return currentUrl === matchUrl;
  }
};
export let importedFormat: Array<ImportedFormat> = [];
export const setImportedFormat = (ary: Array<ImportedFormat>) => {
  importedFormat = ary;
};

export type ImportedFormat = {
  id: string;
  title: string;
  downloadUrl: string;
  style: CompressedStyle[];
};
