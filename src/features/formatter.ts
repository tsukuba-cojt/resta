import * as prop from './prop';
import { UnRedo, UnRedoChanges, pushLog, resetUndoStack } from './ReUndo';
import loadRestaSetting from './setting_loader';

export const initStyle = async () => {
  // localからjson形式のデータを取得しparseしたものをformatsAryへ代入
  await loadRestaSetting();
  // このページに対応するフォーマットがあれば適用
  applyFormats();
};

/**
 * スタイルに変更を加えてformatsListに変更内容を追加
 * formatsListはsaveFormat()でlocalに保存される
 * Undo可能
 */
export const setFormatAndPushToAry = (
  cssSelector: string | null,
  key: string | null,
  value: string | null,
  id: number | null
) => {
  if (!cssSelector) {
    console.log('setFormatAndPushToAry:invalid args, xpath is not found');
    return;
  }
  const elements = Array.from<HTMLElement>(
    document.querySelectorAll(cssSelector)
  );
  elements.forEach((elem) => {
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
    pushToAry(cssSelector, key, value, id);
    console.log('format changed', cssSelector, key, value);
  });
};

/**
 * formatsArrayに変更内容を追加、ログにも追加する
 * すでに同じ要素がある場合は上書きし優先度レイヤーをトップにする
 * ログを返す
 */
const pushToAry = (
  cssSelector: string | null,
  key: string | null,
  value: string | null,
  id: number | null
) => {
  if (!cssSelector) {
    console.log('setFormatAndPushToAry:invalid args, xpath is not found');
    return null;
  }
  if (!key) {
    console.log('setFormatAndPushToAry:invalid args, key is not found');
    return null;
  }
  if (!value && value !== '') {
    console.log('setFormatAndPushToAry:invalid args, value is not found');
    return null;
  }
  if (!id) {
    id = 0;
  }
  // 以下のif文は、各配列が存在しない場合に配列を作成する処理
  // すでに該当箇所への変更がある場合は書き換えている
  if (!prop.formatsArray.find((e) => e.url === prop.edittedUrl)) {
    prop.formatsArray.push({ url: prop.edittedUrl, formats: [] });
  }
  if (
    !prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.cssSelector === cssSelector)
  ) {
    prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.push({ cssSelector: cssSelector, changes: [] });
  }
  if (
    !prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.cssSelector === cssSelector)
      ?.changes.find((e) => e.cssKey === key)
  ) {
    prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.cssSelector === cssSelector)
      ?.changes.push({ cssKey: key, cssValues: [] });
  }
  if (
    !prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.cssSelector === cssSelector)
      ?.changes.find((e) => e.cssKey === key)
      ?.cssValues.find((e) => e.id === id)
  ) {
    // idに対応する要素を追加する
    prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.cssSelector === cssSelector)
      ?.changes.find((e) => e.cssKey === key)
      ?.cssValues.push({ id: id, cssValue: value });
    console.log('pushToAry:push', prop.formatsArray);
    return {
      undo: {
        type: 'delete',
        cssSelector: cssSelector,
        cssKey: key,
        cssValue: value,
        id: id,
        index: 0,
      },
      redo: {
        type: 'create',
        cssSelector: cssSelector,
        cssKey: key,
        cssValue: value,
        id: id,
        index: undefined,
      },
    };
  } else {
    // すでにidに対応する要素がある場合
    // その要素を削除して末尾に追加する
    const index = getIndex(cssSelector, key, id);
    if (index == undefined) {
      console.log('pushToAry: bug detected, index is undefined');
    }
    // idに対応する要素を取り除く
    const log = prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.cssSelector === cssSelector)
      ?.changes.find((e) => e.cssKey === key)
      ?.cssValues.splice(
        prop.formatsArray
          .find((e) => e.url === prop.edittedUrl)
          ?.formats.find((e) => e.cssSelector === cssSelector)
          ?.changes.find((e) => e.cssKey === key)
          ?.cssValues.findIndex((e) => e.id === id) || 0,
        1
      );
    // idに対応する要素を追加する
    // これにより、idに対応する要素が最後尾に移動する
    prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.cssSelector === cssSelector)
      ?.changes.find((e) => e.cssKey === key)
      ?.cssValues.push({ id: id, cssValue: value });
    console.log('pushToAry:already exists, overwrite', prop.formatsArray);
    return {
      undo: {
        type: 'rewrite',
        cssSelector: cssSelector,
        cssKey: key,
        cssValue: log ? log[0].cssValue : '',
        id: id,
        index: index || 0,
      },
      redo: {
        type: 'rewrite',
        cssSelector: cssSelector,
        cssKey: key,
        cssValue: value,
        id: id,
        index: undefined,
      },
    };
  }
};

const getIndex = (
  cssSelector: string,
  key: string,
  id: number
): number | undefined => {
  return prop.formatsArray
    .find((e) => e.url === prop.edittedUrl)
    ?.formats.find((e) => e.cssSelector === cssSelector)
    ?.changes.find((e) => e.cssKey === key)
    ?.cssValues.findIndex((e) => e.id === id);
};

export const saveFormat = () => {
  if (prop.formatsArray.length == 0) return;
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsArray) })
    .then(() => {
      console.log('save', prop.currentUrl, prop.formatsArray);
    });
};

export const applyFormats = () => {
  const formats = prop.formatsArray.filter((e) => prop.currentUrl.match(e.url));
  for (const f of formats) {
    // console.log(f);
    for (const format of f.formats) {
      const cssSelector = format.cssSelector;
      const elements = Array.from<HTMLElement>(
        document.querySelectorAll(cssSelector)
      );
      elements.forEach((elem) => {
        for (const change of format.changes) {
          console.log(
            'apply:',
            cssSelector,
            change.cssKey,
            change.cssValues[change.cssValues.length - 1].cssValue
          );
          elem.style[change.cssKey as any] =
            change.cssValues[change.cssValues.length - 1].cssValue;
        }
      });
    }
  }
};
