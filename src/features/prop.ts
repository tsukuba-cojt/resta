import { Format } from '../types/Format';
import { removeStyleRule, setStyleRule } from './style_sheet';
import * as resta_console from './resta_console';
import { CompressedStyle } from './style_compresser';
import { ImportedFormatAbstract } from './importStyle';
import { IPropsContext } from '../contexts/PropsContext';

// 現在のURLを格納する変数
export let currentUrl: string;
export const setUrl = (url: string) => {
  const urlObj = new URL(url);
  currentUrl = urlObj.origin + urlObj.pathname;
};

/**
 * Formatの配列から、cssKeyに対応するスタイルを返す
 * 見つからない場合はfalseを返す
 */
export const getDisplayedFormat = (
  formats: (Format | undefined)[],
  cssKey: string,
): string | false => {
  if (!formats || formats.length === 0) {
    return false;
  }
  const format: (Format | undefined)[] = formats.filter(
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

export const updateFormat = (
  cssSelector: string,
  cssKey: string,
  prop: IPropsContext,
) => {
  const value = getDisplayedFormat(
    prop.formatsArray
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
  setStyleRule(
    {
      cssSelector: cssSelector,
      keys: [cssKey],
    },
    prop,
  );
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

export type ImportedFormat = {
  style: CompressedStyle[];
} & ImportedFormatAbstract;
