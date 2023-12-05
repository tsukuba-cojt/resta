import * as prop from './prop';
import { FormatBlockByURL } from '../types/Format';
import * as resta_console from './resta_console';
import { debounce } from './debounce';
import { IPropsContext } from '../contexts/PropsContext';
import useFormatUtils from '../hooks/useFormatUtils';
/**
 * localにフォーマットを保存する
 */

export const saveFormat = async () => {
  const debounceSave = debounce(save, 1000);
  debounceSave(new Date());
};

let lastSaveTime = new Date();

/**
 * Saves the formats to local storage.
 *
 * @param date - The current date.
 */
const save = (date: Date, prop: IPropsContext): void => {
  if (lastSaveTime.getTime() + 1000 > date.getTime()) {
    return;
  }
  lastSaveTime = date;
  // フォーマットを詳細度の低い順にソートする
  prop.setFormatsArray(
    prop.formatsArray
      .filter((e) => e.formats.length !== 0)
      .sort(
        (e) =>
          (e.url.match(/\//g) || []).length &&
          (e.url[e.url.length - 1] === '*' ? -1 : 1),
      ),
  );
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsArray) })
    .then(() => {
      resta_console.log('save', prop.currentUrl, prop.formatsArray);
    });
};

export const saveFormatImmediately = async (prop: IPropsContext) => {
  useFormatUtils().sortFormats();
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsArray) })
    .then(() => {
      resta_console.log('save', prop.currentUrl, prop.formatsArray);
    });
};

/**
 * localからフォーマットを読み込む
 */
export const loadFormat = async (prop: IPropsContext) => {
  await chrome.storage.local.get(['formats']).then((result) => {
    if (!result.formats) {
      resta_console.log('load:no format', prop.currentUrl);
      return;
    } else {
      resta_console.log('load', prop.currentUrl, JSON.parse(result.formats));
      if (JSON.parse(result.formats))
        prop.setFormatsArray(
          (JSON.parse(result.formats) as Array<FormatBlockByURL>).filter(
            (e) => e.formats.length !== 0,
          ),
        );
      return;
    }
  });
};

export const getFormatAryFromLocal = async (): Promise<any> => {
  await chrome.storage.local.get(['formats']).then((result) => {
    if (!result.formats) {
      resta_console.log('load:no format', prop.currentUrl);
      return [];
    } else {
      const ary = (
        JSON.parse(result.formats) as Array<FormatBlockByURL>
      ).filter((e) => e.formats.length !== 0);
      resta_console.log('load', prop.currentUrl, ary);
      return ary;
    }
  });
};

/**
 * localからフォーマットを読み込む
 * もしURLが指定されていなかったらすべてのフォーマットを読み込む
 */
/*
export const loadFormatForOutput = async (url: string = '') => {
  await chrome.storage.local.get(['formats']).then((result) => {
    if (!result.formats) {
      resta_console.log('load:no format', url);
      return;
    } else {
      resta_console.log('load', url, JSON.parse(result.formats));
      if (JSON.parse(result.formats))
        prop.setFormatsAry(
          (JSON.parse(result.formats) as Array<FormatBlockByURL>).filter(
            (e) => e.formats.length !== 0,
          ),
        );
      return;
    }
  });
};
*/

/**
 * localからimportしたフォーマットを読み込む
 */
export const loadImportedStyle = async (prop: IPropsContext) => {
  await chrome.storage.local.get(['imported_style']).then((result) => {
    if (!result.imported_style) {
      resta_console.log('loadImportedStyle:no format');
      return;
    } else {
      try {
        resta_console.log('loadImportedStyle', result.imported_style);
        prop.setImportedFormats(
          (result.imported_style as Array<prop.ImportedFormat>).filter(
            (e) => e.style.length !== 0,
          ),
        );
        resta_console.log('loadImportedStyle', prop.importedFormats);
      } catch (e) {
        resta_console.error('loadImportedStyle', e);
      }
    }
    return;
  });
};
