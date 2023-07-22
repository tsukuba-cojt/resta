import * as prop from './prop';
import { FormatBlockByURL } from '../types/Format';
import * as resta_console from './resta_console';
import { debounce } from './debounce';
/**
 * localにフォーマットを保存する
 */

export const saveFormat = async () => {
  const debounceSave = debounce(save, 1000);
  debounceSave(new Date());
};

let lastSaveTime = new Date();

const save = (date: Date): void => {
  if (lastSaveTime.getTime() + 1000 > date.getTime()) {
    return;
  }
  lastSaveTime = date;
  prop.sortFormats();
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsArray) })
    .then(() => {
      resta_console.log('save', prop.currentUrl, prop.formatsArray);
    });
};

export const saveFormatImmediately = async () => {
  prop.sortFormats();
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsArray) })
    .then(() => {
      resta_console.log('save', prop.currentUrl, prop.formatsArray);
    });
};

/**
 * localからフォーマットを読み込む
 */
export const loadFormat = async () => {
  await chrome.storage.local.get(['formats']).then((result) => {
    if (!result.formats) {
      resta_console.log('load:no format', prop.currentUrl);
      return;
    } else {
      resta_console.log('load', prop.currentUrl, JSON.parse(result.formats));
      if (JSON.parse(result.formats))
        prop.setFormatsAry(
          (JSON.parse(result.formats) as Array<FormatBlockByURL>).filter(
            (e) => e.formats.length !== 0
          )
        );
      return;
    }
  });
};
/**
 * localからフォーマットを読み込む
 * もしURLが指定されていなかったらすべてのフォーマットを読み込む
 */
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
            (e) => e.formats.length !== 0
          )
        );
      return;
    }
  });
};
