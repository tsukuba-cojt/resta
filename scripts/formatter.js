import { getElementByXpath } from "./xpath_control.js";
import * as prop from "./prop.js";

export const initStyle = async () => {
  // localからjson形式のデータを取得しparseしたものをformatsAryへ代入
  await loadFormat();
  // このページに対応するフォーマットがあれば適用
  applyFormats();
};
// スタイルに変更を加えてformatsListに変更内容を追加
export const setFormatAndPushToAry = (xpath, key, value) => {
  const elem = getElementByXpath(xpath);
  if (!elem || !key || !value) {
    console.log("setFormatAndPushToAry:invalid args:", xpath, key, value);
    return;
  }
  // スタイルの変更
  elem.style[key] = value;
  // 配列への追加処理
  // 以下のif文は、各配列が存在しない場合に配列を作成する処理
  // すでに該当箇所への変更がある場合は書き換えている
  if (
    !prop.formatsAry ||
    !prop.formatsAry.find((e) => e.url === prop.edittedUrl)
  ) {
    prop.formatsAry.push({ url: prop.edittedUrl, formats: [] });
  }
  if (
    !prop.formatsAry
      .find((e) => e.url === prop.edittedUrl)
      .formats.find((e) => e.xpath === xpath)
  ) {
    prop.formatsAry
      .find((e) => e.url === prop.edittedUrl)
      .formats.push({ xpath: xpath, styles: [] });
  }
  if (
    prop.formatsAry
      .find((e) => e.url === prop.edittedUrl)
      .formats.find((e) => e.xpath === xpath)
      .styles.find((e) => e.key === key)
  ) {
    prop.formatsAry
      .find((e) => e.url === prop.edittedUrl)
      .formats.find((e) => e.xpath === xpath)
      .styles.find((e) => e.key === key).value = value;
  } else {
    prop.formatsAry
      .find((e) => e.url === prop.edittedUrl)
      .formats.find((e) => e.xpath === xpath)
      .styles.push({ key: key, value: value });
  }
  console.log(prop.formatsAry);
};

export const loadFormat = async () => {
  await chrome.storage.local.get(["formats"]).then((result) => {
    if (!result.formats) {
      console.log("load:no format", prop.currentUrl);
      return;
    } else {
      console.log("load", prop.currentUrl, JSON.parse(result.formats));
      if (JSON.parse(result.formats))
        prop.setFormatsAry(JSON.parse(result.formats));
      return;
    }
  });
};

export const saveFormat = () => {
  if (prop.formatsAry.length == 0) return;
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsAry) })
    .then(() => {
      console.log("save", prop.currentUrl, prop.formatsAry);
    });
};

export const applyFormats = () => {
  const formats = prop.formatsAry.filter((e) => prop.currentUrl.match(e.url));
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
