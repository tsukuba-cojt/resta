import { CompressedStyle } from './style_compresser';
import * as prop from './prop';
import { error } from './resta_console';
import { StyleRule, StyleValue } from './style_sheet';
import { setFormatsAndPushToAry } from './formatter';

export const importFormat = async (
  downloadUrl: string,
  title: string,
  style: string,
  id: string
) => {
  if (prop.importedFormat.find((e) => e.id === id)) {
    // すでに登録されている場合は取り出す
    prop.setImportedFormat(prop.importedFormat.filter((e) => e.id !== id));
  }
  prop.importedFormat.push({
    id: id,
    title: title,
    downloadUrl: downloadUrl,
    style: JSON.parse(style) as CompressedStyle,
  });
  chrome.storage.local.set({ imported_style: prop.importedFormat });
};

export const applyPageFormat = (id: string) => {
  const format = prop.importedFormat.find((e) => e.id === id);
  if (!format) {
    error('applyPageFormat', 'format not found');
    return;
  }
  let styleRule: StyleRule[] = [];
  for (const changes of format.style.format) {
    const styleValues: StyleValue[] = [];
    for (const change of changes.changes) {
      styleValues.push({
        key: change.cssKey,
        value: change.cssValue,
      });
    }
    styleRule.push({
      id: id,
      cssSelector: changes.cssSelector,
      values: styleValues,
    });
  }
  setFormatsAndPushToAry(styleRule);
};

export const getImportedFormats = (
  all: boolean = false
): ImportedFormatAbstract[] => {
  if (all) {
    return prop.importedFormat.map((e) => {
      return {
        id: e.id,
        title: e.title,
        downloadUrl: e.downloadUrl,
      };
    });
  } else {
    return prop.importedFormat
      .filter((e) => prop.matchUrl(prop.currentUrl, e.style.url))
      .map((e) => {
        return {
          id: e.id,
          title: e.title,
          downloadUrl: e.downloadUrl,
        };
      });
  }
};

export type ImportedFormatAbstract = {
  id: string;
  title: string;
  downloadUrl: string;
};
