import { CompressedStyle } from './style_compresser';
import { error, log } from './resta_console';
import { StyleRule, StyleValue } from './style_sheet';
import { setFormatsAndPushToAry } from './formatter';
import { IPropsContext } from '../contexts/PropsContext';
import { matchUrl } from '../utils/urlUtil';

export const importFormat = async (
  downloadUrl: string,
  title: string,
  style: string,
  id: string,
  imageUrl: string | undefined,
  author: string | undefined,
  prop: IPropsContext,
) => {
  if (prop.importedFormats.find((e) => e.id === id)) {
    // すでに登録されている場合は取り出す
    prop.setImportedFormats(prop.importedFormats.filter((e) => e.id !== id));
  }
  prop.importedFormats.push({
    id,
    title,
    downloadUrl,
    imageUrl,
    author,
    style: JSON.parse(style) as CompressedStyle[],
  });
  await chrome.storage.local.set({ imported_style: prop.importedFormats });
};

export const applyPageFormat = (id: string, prop: IPropsContext) => {
  const format = prop.importedFormats.find((e) => e.id === id);
  if (!format) {
    error('applyPageFormat', 'format not found');
    return;
  }
  let styleRule: StyleRule[] = [];
  for (const changes of format.style[0].format) {
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
  setFormatsAndPushToAry(styleRule, prop);
};

export const deleteImportedFormat = (id: string, prop: IPropsContext) => {
  prop.setImportedFormats(prop.importedFormats.filter((e) => e.id !== id));
  chrome.storage.local.set({ imported_style: prop.importedFormats });
};

export const deleteAllImportedFormat = (prop: IPropsContext) => {
  prop.setImportedFormats([]);
  chrome.storage.local.set({ imported_style: prop.importedFormats });
};

export const getImportedFormats = (
  prop: IPropsContext,
  all: boolean = false,
): ImportedFormatAbstract[] => {
  log('getImportedFormats', prop.importedFormats);
  if (all) {
    return prop.importedFormats.map((e) => {
      return { ...e };
    });
  } else {
    return prop.importedFormats
      .filter((e) => matchUrl(prop.currentUrl, e.style[0].url))
      .map((e) => {
        return { ...e };
      });
  }
};

export type ImportedFormatAbstract = {
  id: string;
  title: string;
  downloadUrl: string;
  imageUrl?: string;
  author?: string;
};
