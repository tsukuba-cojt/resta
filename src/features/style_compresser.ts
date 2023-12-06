import * as prop from './prop';
import { FormatBlockByURL, FormatChange } from '../types/Format';
import { getFormatAryFromLocal } from './format_manager';
export const compressStyle = (url: string): CompressedStyle | false => {
  const compressedFormats: CompressedFormat[] = [];
  // 優先度の高い順にルールを追加する
  // すでに登録されている場合はスキップする
  getFormatAryFromLocal().then((result) => {
    if (!result) {
      return;
    }
    for (const format of result
      .filter((e: FormatBlockByURL) => {
        return prop.matchUrl(url, e.url);
      })
      .reverse()) {
      for (const f of format.formats) {
        insertStyleRule(f.cssSelector, f.changes, compressedFormats);
      }
    }
  });
  if (compressedFormats.length === 0) {
    return false;
  }
  return {
    url: url,
    format: compressedFormats,
  };
};

const insertStyleRule = (
  cssSelector: string,
  changes: FormatChange[],
  formats: CompressedFormat[],
) => {
  if (!changes || changes.length === 0) {
    return;
  }
  if (!formats.find((e) => e.cssSelector === cssSelector)) {
    formats.push({
      cssSelector: cssSelector,
      changes: [],
    });
  }
  for (const change of changes) {
    // すでに登録されている場合はスキップ
    if (
      !formats
        .find((e) => e.cssSelector === cssSelector)
        ?.changes.find((e) => e.cssKey === change.cssKey)
    ) {
      formats
        .find((e) => e.cssSelector === cssSelector)
        ?.changes.push({
          cssKey: change.cssKey,
          cssValue: change.cssValues[change.cssValues.length - 1].cssValue,
        });
    }
  }
};

export type CompressedStyle = {
  url: string;
  format: CompressedFormat[];
};

export type CompressedFormat = {
  cssSelector: string;
  changes: CompressedChange[];
};

export type CompressedChange = {
  cssKey: string;
  cssValue: string;
};
