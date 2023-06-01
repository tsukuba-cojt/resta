import { getElementByXpath } from './xpath_control';
import * as prop from './prop';

export const initStyle = async () => {
  // localからjson形式のデータを取得しparseしたものをformatsAryへ代入
  await loadFormat();
  // このページに対応するフォーマットがあれば適用
  applyFormats();
};

/**
 * スタイルに変更を加えてformatsListに変更内容を追加
 * formatsListはsaveFormat()でlocalに保存される
 */
export const setFormatAndPushToAry = (
  xpath: string | null,
  key: string | null,
  value: string | null,
  id: number | null
) => {
  if (!xpath) {
    console.log('setFormatAndPushToAry:invalid args, xpath is not found');
    return;
  }
  const elem = getElementByXpath(xpath);
  if (!elem) {
    console.log('setFormatAndPushToAry:invalid args, elem is not found');
    return;
  }
  if (!key) {
    console.log('setFormatAndPushToAry:invalid args, key is not found');
    return;
  }
  if (!value && value !== '') {
    console.log('setFormatAndPushToAry:invalid args, value is not found');
    return;
  }
  // スタイルの変更
  elem.style[key as any] = value;
  // 配列への追加処理
  pushToAry(xpath, key, value, id);
  console.log('format changed', xpath, key, value);
};

/**
 * formatsArrayに変更内容を追加。
 * すでに同じ要素がある場合は上書きし優先度レイヤーをトップにする
 */
const pushToAry = (
  xpath: string | null,
  key: string | null,
  value: string | null,
  id: number | null
) => {
  if (!xpath) {
    console.log('setFormatAndPushToAry:invalid args, xpath is not found');
    return;
  }
  if (!key) {
    console.log('setFormatAndPushToAry:invalid args, key is not found');
    return;
  }
  if (!value && value !== '') {
    console.log('setFormatAndPushToAry:invalid args, value is not found');
    return;
  }
  if (!id) {
    id = 0;
  }
  // 以下のif文は、各配列が存在しない場合に配列を作成する処理
  // すでに該当箇所への変更がある場合は書き換えている
  if (!prop.formatsArray.find((e) => e.xpath === xpath)) {
    prop.formatsArray.push({ xpath: xpath, changes: [] });
  }
  if (
    !prop.formatsArray
      .find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.key === key)
  ) {
    prop.formatsArray
      .find((e) => e.xpath === xpath)
      ?.changes.push({ key: key, values: [] });
  }
  if (
    !prop.formatsArray
      .find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.key === key)
      ?.values.find((e) => e.id === id)
  ) {
    prop.formatsArray
      .find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.key === key)
      ?.values.push({ id: id, value: value });
  } else {
    // idに対応する要素を取り除く
    prop.formatsArray
      .find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.key === key)
      ?.values.filter((e) => e.id !== id);
    // idに対応する要素を追加する
    // これにより、idに対応する要素が最後尾に移動する
    prop.formatsArray
      .find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.key === key)
      ?.values.push({ id: id, value: value });
  }
};

// スタイルに変更を加えてformatsListに変更内容を追加
export const setFormatAndPushToAryOld = (
  xpath: string | null,
  key: string | null,
  value: string | null
) => {
  const elem = getElementByXpath(xpath);
  if (!elem || !key || (!value && value !== '')) {
    console.log('setFormatAndPushToAry:invalid args:', xpath, key, value);
    return;
  }
  // スタイルの変更
  elem.style[key as any] = value;
  // 配列への追加処理
  // 以下のif文は、各配列が存在しない場合に配列を作成する処理
  // すでに該当箇所への変更がある場合は書き換えている
  if (
    !prop.formatsAryOld ||
    !prop.formatsAryOld.find((e) => e.url === prop.edittedUrl)
  ) {
    prop.formatsAryOld.push({ url: prop.edittedUrl, formats: [] });
  }
  if (
    !prop.formatsAryOld
      .find((e) => e.url === prop.edittedUrl)
      .formats.find((e: any) => e.xpath === xpath)
  ) {
    prop.formatsAryOld
      .find((e) => e.url === prop.edittedUrl)
      .formats.push({ xpath: xpath, styles: [] });
  }
  if (
    prop.formatsAryOld
      .find((e) => e.url === prop.edittedUrl)
      .formats.find((e: any) => e.xpath === xpath)
      .styles.find((e: any) => e.key === key)
  ) {
    prop.formatsAryOld
      .find((e) => e.url === prop.edittedUrl)
      .formats.find((e: any) => e.xpath === xpath)
      .styles.find((e: any) => e.key === key).value = value;
  } else {
    prop.formatsAryOld
      .find((e) => e.url === prop.edittedUrl)
      .formats.find((e: any) => e.xpath === xpath)
      .styles.push({ key: key, value: value });
  }
  console.log('format changed', xpath, key, value);
};

export const loadFormat = async () => {
  await chrome.storage.local.get(['formats']).then((result) => {
    if (!result.formats) {
      console.log('load:no format', prop.currentUrl);
      return;
    } else {
      console.log('load', prop.currentUrl, JSON.parse(result.formats));
      if (JSON.parse(result.formats))
        prop.setFormatsAry(JSON.parse(result.formats));
      return;
    }
  });
};

export const saveFormat = () => {
  if (prop.formatsAryOld.length == 0) return;
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsAryOld) })
    .then(() => {
      console.log('save', prop.currentUrl, prop.formatsAryOld);
    });
};

export const applyFormats = () => {
  const formats = prop.formatsAryOld.filter((e) =>
    prop.currentUrl.match(e.url)
  );
  for (const f of formats) {
    console.log(f);
    for (const format of f.formats) {
      const xpath = format.xpath;
      const styles = format.styles;
      const elem = getElementByXpath(xpath);
      if (!elem) continue;
      for (const style of styles) {
        console.log(style);
        elem.style[style.key] = style.value;
      }
    }
  }
};
