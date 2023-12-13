import * as prop from './prop';
import { FormatBlockByURL } from '../types/Format';
import * as resta_console from './resta_console';
import { debounce } from './debounce';
import { IPropsContext } from '../contexts/PropsContext';
/**
 * localにフォーマットを保存する
 */

export const saveFormat = async (prop: IPropsContext) => {
  const debounceSave = debounce(saveImediately, 1000);
  debounceSave(prop);
};

/**
 * Saves the formats to local storage.
 *
 * @param date - The current date.
 */
export const saveImediately = async (prop: IPropsContext): Promise<any> => {
  // フォーマットを詳細度の低い順にソートする
  const newArray = prop.formatsArray
    .filter((e) => e.formats.length !== 0)
    .sort(
      (e) =>
        (e.url.match(/\//g) || []).length &&
        (e.url[e.url.length - 1] === '*' ? -1 : 1),
    );
  prop.setFormatsArray(newArray);
  await save(newArray);
};

export const save = async (ary: FormatBlockByURL[]) => {
  await chrome.storage.local.set({ formats: JSON.stringify(ary) });
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
