import { loadFormat } from './format_manager';
import * as prop from './prop';
import { StyleRule, removeStyleRule, setStyleRule } from './style_sheet';
import { UnRedoCommand, UnRedoCommands, pushLog } from './unredo';

export const initStyle = async () => {
  // localからjson形式のデータを取得しparseしたものをformatsAryへ代入
  await loadFormat();
  // このページに対応するフォーマットがあれば適用
  applyFormats();
};

export const setFormatsAndPushToAry = (rules: Array<StyleRule>) => {
  const commands: UnRedoCommands = { commands: [] };
  for (const rule of rules) {
    for (const value of rule.values) {
      setStyleRule(rule);
      const c = pushToAry(rule.cssSelector, value.key, value.value, 0);
      if (c) {
        commands.commands.push(c);
      }
    }
  }
  if (commands.commands.length > 0) {
    pushLog(commands);
  }
};

export type RemoveRule = {
  cssSelector: string;
  key: string;
  id: number;
};

export const removeFormatsAndPushToAry = (values: Array<RemoveRule>) => {
  const commands: UnRedoCommands = { commands: [] };
  for (const value of values) {
    const c = deleteFromAry(value.cssSelector, value.key, value.id);
    if (c) {
      commands.commands.push(c);
    }
  }
  if (commands.commands.length > 0) {
    pushLog(commands);
  }
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
  console.log('setFormatAndPushToAry', cssSelector, key, value, id);
  if (!id) {
    id = 0;
  }
  if (!cssSelector) {
    console.log('setFormatAndPushToAry:invalid args, cssSelector is not found');
    return;
  }
  if (!key && key !== '') {
    console.log('setFormatAndPushToAry:invalid args, key is not found');
    return;
  }
  if (!value && value !== '') {
    console.log('setFormatAndPushToAry:invalid args, value is not found');
    return;
  }
  setStyleRule({
    cssSelector: cssSelector,
    values: [{ key: key, value: value }],
  });
  const c = pushToAry(cssSelector, key, value, id);
  if (c) {
    pushLog({
      commands: [c],
    });
  }
};

/**
 * formatsArrayに変更内容を追加、ログにも追加する
 * すでに同じ要素がある場合は上書きし優先度レイヤーをトップにする
 * ログを返す
 */
export const pushToAry = (
  cssSelector: string | null,
  key: string | null,
  value: string | null,
  id: number | null
): UnRedoCommand | null => {
  if (!cssSelector) {
    console.log('pushToAry:invalid args, cssSelector is not found');
    return null;
  }
  if (!key) {
    console.log('pushToAry:invalid args, key is not found');
    return null;
  }
  if (!value && value !== '') {
    console.log('pushToAry:invalid args, value is not found');
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
    // console.log('pushToAry:push', cssSelector, key, value);
    return {
      cssSelector: cssSelector,
      cssKey: key,
      id: id,
      undo: {
        type: 'delete',
        cssValue: value,
        index: 0,
      },
      redo: {
        type: 'create',
        cssValue: value,
        index: undefined,
      },
    };
  } else {
    // すでにidに対応する要素がある場合
    // その要素を削除して末尾に追加する
    const index = getIndex(cssSelector, key, id);
    if (index == undefined || index === -1) {
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
    // console.log('pushToAry:already exists, overwrite', cssSelector, key, value);
    return {
      cssSelector: cssSelector,
      cssKey: key,
      id: id,
      undo: {
        type: 'rewrite',
        cssValue: log ? log[0].cssValue : '',
        index: index || 0,
      },
      redo: {
        type: 'rewrite',
        cssValue: value,
        index: undefined,
      },
    };
  }
};

/**
 * formatsArrayから変更内容を削除
 */
export const deleteFromAry = (
  cssSelector: string,
  key: string,
  id: number
): UnRedoCommand | null => {
  const index = getIndex(cssSelector, key, id);
  if (index == undefined || index === -1) {
    console.log('deleteFromAry: bug detected, index is undefined');
  }
  const deletedElem = prop.formatsArray
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
  if (!deletedElem) {
    console.log('deleteFromAry: bug detected, deletedElem is undefined');
    return null;
  }
  const style = prop.formatsArray
    .find((e) => e.url === prop.edittedUrl)
    ?.formats.find((e) => e.cssSelector === cssSelector)
    ?.changes.find((e) => e.cssKey === key)?.cssValues;
  if (!style) {
    removeStyleRule(cssSelector, key);
  } else {
    // 削除した要素を適用する
    setStyleRule({
      cssSelector: cssSelector,
      values: [{ key: key, value: prop.getValue(style) }],
    });
  }
  console.log('deleteFromAry', prop.formatsArray);
  return {
    cssSelector: cssSelector,
    cssKey: key,
    id: id,
    undo: {
      type: 'create',
      cssValue: deletedElem ? deletedElem[0].cssValue : '',
      index: index || 0,
    },
    redo: {
      type: 'delete',
      cssValue: '',
      index: undefined,
    },
  };
};

export const reloadStyle = (cssSelector: string, key: string) => {
  const style = prop.formatsArray
    .find((e) => e.url === prop.edittedUrl)
    ?.formats.find((e) => e.cssSelector === cssSelector)
    ?.changes.find((e) => e.cssKey === key)?.cssValues;
  if (!style) {
    return;
  }
  setStyleRule({
    cssSelector: cssSelector,
    values: [{ key: key, value: prop.getValue(style) }],
  });
};

/**
 * 要素の、cssSelectorに対するスタイルスタックのindexを返す
 * 要素がない場合はundefinedを返す
 */
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

/**
 * formatsArrayに登録されているフォーマットを適用する
 * 比較的重い処理なので、ページ遷移時などに呼び出す
 */
export const applyFormats = () => {
  const formats = prop.formatsArray.filter((e) =>
    matchUrl(prop.currentUrl, e.url)
  );
  console.log('start:applyFormats', formats);
  for (const f of formats) {
    // console.log(f);
    for (const format of f.formats) {
      const cssSelector = format.cssSelector;
      setStyleRule({
        cssSelector: cssSelector,
        values: format.changes
          .map((e) => {
            if (e.cssValues.length !== 0) {
              return {
                key: e.cssKey,
                value: e.cssValues[e.cssValues.length - 1].cssValue,
              };
            } else {
              return { key: '', value: '' };
            }
          })
          .filter((e) => e.key !== '' && e.value !== ''),
      });
    }
  }
};

export const matchUrl = (url: string, matchUrl: string) => {
  if (!matchUrl || !url) {
    return false;
  }
  let hasWildcard = false;
  let compareUrl = '';
  // 最後の文字が*ならワイルドカードとして扱う
  if (matchUrl[matchUrl.length - 1] === '*') {
    hasWildcard = true;
    compareUrl = matchUrl.slice(0, -1);
  }
  if (hasWildcard) {
    return url === compareUrl || url.startsWith(compareUrl);
  } else {
    return url === matchUrl;
  }
};
