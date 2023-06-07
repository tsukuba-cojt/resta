import * as prop from './prop';

/**
 * localにフォーマットを保存する
 */

export const saveFormat = () => {
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsArray) })
    .then(() => {
      console.log('save', prop.currentUrl, prop.formatsArray);
    });
};
/**
 * localからフォーマットを読み込む
 */

export const loadFormat = async () => {
  await chrome.storage.local.get(['formats']).then((result) => {
    if (!result.formats) {
      console.log('load:no format', prop.currentUrl);
      return;
    } else {
      console.log('load', prop.currentUrl, JSON.parse(result.formats));
      if (JSON.parse(result.formats))
        prop.setFormatsAry(
          JSON.parse(result.formats) as Array<prop.FormatBlockByURL>
        );
      return;
    }
  });
};
