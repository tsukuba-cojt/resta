import { getElementByXpath } from './xpath_control';
import * as prop from './prop';
import { UnRedo, UnRedoChanges, pushLog, resetUndoStack } from './ReUndo';

export const initStyle = async () => {
  // localからjson形式のデータを取得しparseしたものをformatsAryへ代入
  await loadFormat();
  // このページに対応するフォーマットがあれば適用
  applyFormats();
};

/**
 * スタイルに変更を加えてformatsListに変更内容を追加
 * formatsListはsaveFormat()でlocalに保存される
 * Undo可能
 */
export const applyFormatAndSave = (
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
  const undoChanges = applyAndPushFormat(xpath, key, value, id);
  if (undoChanges) {
    // undoStackへの追加
    pushLog(undoChanges);
  }
};

/**
 * chrome.storage.localからフォーマットを読み込む
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

/**
 * chrome.storage.localにフォーマットを保存する
 */
export const saveFormat = () => {
  if (prop.formatsArray.length == 0) return;
  chrome.storage.local
    .set({ formats: JSON.stringify(prop.formatsArray) })
    .then(() => {
      console.log('save', prop.edittedUrl, prop.formatsArray);
    });
};
/**
 * 現在のページに対応するフォーマットを適用する
 */
export const applyFormats = () => {
  const formats = prop.formatsArray.filter((e) => prop.currentUrl.match(e.url));
  for (const f of formats) {
    // console.log(f);
    for (const format of f.formats) {
      const xpath = format.xpath;
      const elem = getElementByXpath(xpath);
      if (!elem) continue;
      for (const change of format.changes) {
        console.log(
          'apply:',
          xpath,
          change.cssKey,
          change.cssValues[change.cssValues.length - 1].cssValue
        );
        elem.style[change.cssKey as any] =
          change.cssValues[change.cssValues.length - 1].cssValue;
      }
    }
  }
  resetUndoStack();
};

/**
 * idとxpathに対応する要素を削除する
 */
export const deleteFormat = (xpath: string, id: number) => {
  const elem = getElementByXpath(xpath);
  const unRedoChanges: UnRedoChanges = { changes: [] };
  if (!elem) return;
  const format = prop.formatsArray
    .find((e) => e.url === prop.edittedUrl)
    ?.formats.find((e) => e.xpath === xpath);
  if (!format) return;
  for (const change of format.changes) {
    const index = change.cssValues.findIndex((e) => e.id === id);
    if (index == -1) {
      console.log('deleteFormat:invalid args, id is not found');
      return;
    }
    const prevVal = change.cssValues.splice(index, 1);
    elem.style[change.cssKey as any] =
      change.cssValues[change.cssValues.length - 1].cssValue;
    unRedoChanges.changes.push({
      undo: {
        type: 'create',
        xpath: xpath,
        cssKey: change.cssKey,
        cssValue: prevVal[0].cssValue,
        id: id,
        index: index,
      },
      redo: {
        type: 'delete',
        xpath: xpath,
        cssKey: change.cssKey,
        cssValue: '',
        id: id,
        index: undefined,
      },
    });
  }
  pushLog(unRedoChanges);
};

/**
 * formatsArrayに変更内容を追加、ログにも追加する
 * すでに同じ要素がある場合は上書きし優先度レイヤーをトップにする
 * ログを返す
 */
const applyAndPushFormat = (
  xpath: string | null,
  key: string | null,
  value: string | null,
  id: number | null
): UnRedo | null => {
  if (!xpath) {
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
      ?.formats.find((e) => e.xpath === xpath)
  ) {
    prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.push({ xpath: xpath, changes: [] });
  }
  if (
    !prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.cssKey === key)
  ) {
    prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.xpath === xpath)
      ?.changes.push({ cssKey: key, cssValues: [] });
  }
  if (
    !prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.cssKey === key)
      ?.cssValues.find((e) => e.id === id)
  ) {
    // idに対応する要素を追加する
    prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.cssKey === key)
      ?.cssValues.push({ id: id, cssValue: value });
    console.log('pushToAry:push', prop.formatsArray);
    return {
      undo: {
        type: 'delete',
        xpath: xpath,
        cssKey: key,
        cssValue: value,
        id: id,
        index: 0,
      },
      redo: {
        type: 'create',
        xpath: xpath,
        cssKey: key,
        cssValue: value,
        id: id,
        index: undefined,
      },
    };
  } else {
    // すでにidに対応する要素がある場合
    // その要素を削除して末尾に追加する
    const index = getIndex(xpath, key, id);
    if (index == undefined) {
      console.log('pushToAry: bug detected, index is undefined');
    }
    // idに対応する要素を取り除く
    const log = prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.cssKey === key)
      ?.cssValues.splice(index as number, 1);
    // idに対応する要素を追加する
    // これにより、idに対応する要素が最後尾に移動する
    prop.formatsArray
      .find((e) => e.url === prop.edittedUrl)
      ?.formats.find((e) => e.xpath === xpath)
      ?.changes.find((e) => e.cssKey === key)
      ?.cssValues.push({ id: id, cssValue: value });
    console.log('pushToAry:already exists, overwrite', prop.formatsArray);
    return {
      undo: {
        type: 'rewrite',
        xpath: xpath,
        cssKey: key,
        cssValue: log ? log[0].cssValue : '',
        id: id,
        index: index || 0,
      },
      redo: {
        type: 'rewrite',
        xpath: xpath,
        cssKey: key,
        cssValue: value,
        id: id,
        index: undefined,
      },
    };
  }
};

const getIndex = (
  xpath: string,
  key: string,
  id: number
): number | undefined => {
  return prop.formatsArray
    .find((e) => e.url === prop.edittedUrl)
    ?.formats.find((e) => e.xpath === xpath)
    ?.changes.find((e) => e.cssKey === key)
    ?.cssValues.findIndex((e) => e.id === id);
};

const getCssValue = (
  xpath: string,
  key: string,
  id: number
): string | undefined => {
  return prop.formatsArray
    .find((e) => e.url === prop.edittedUrl)
    ?.formats.find((e) => e.xpath === xpath)
    ?.changes.find((e) => e.cssKey === key)
    ?.cssValues.find((e) => e.id === id)?.cssValue;
};
