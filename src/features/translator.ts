// @ts-ignore
import lang from '../consts/json/lang.json';
import { i18n } from 'webextension-polyfill';

// 引数持ち
const t = (key: string, ...params: any) => {
  if (!lang[i18n.getUILanguage()]) {
    return `${i18n.getUILanguage()}.${key}`;
  }

  const s = lang[i18n.getUILanguage()][key];

  if (!s) {
    return `${i18n.getUILanguage()}.${key}`;
  }

  if (params.length == 0 || s) {
    return s ? s : key;
  }

  // 置き換え処理
  const format = require('string-format');
  return format(s, ...params);
};

export default t;
