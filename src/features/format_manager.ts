import * as prop from './prop';
import { FormatBlockByURL } from '../types/Format';
import * as resta_console from './resta_console';

/**
 * localにフォーマットを保存する
 */

export const saveFormat = () => {
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsArray) })
    .then(() => {
      resta_console.log('save', prop.currentUrl, prop.formatsArray);
    });
  prop.sortFormats();
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
          (JSON.parse(result.formats) as Array<FormatBlockByURL>)
            .filter((e) => e.formats.length !== 0)
            .filter((e) => prop.matchUrl(prop.currentUrl, e.url))
        );
      return;
    }
  });
};
