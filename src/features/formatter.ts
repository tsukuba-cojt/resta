import { StyleRule, getStyleSheet, removeStyleRule } from './style_sheet';
import * as resta_console from './resta_console';
import {
  Format,
  FormatBlockByURL,
  FormatChange,
  FormatStyleValue,
} from '../types/Format';
import { IPropsContext } from '../contexts/PropsContext';
import { matchUrl } from '../utils/urlUtil';
import CssCommand from './commands/CssCommand';
import TemplateCommand from './commands/TemplateCommand';
import { currentUrl, getDisplayedFormat, updateFormat } from './prop';
import { saveFormat } from './format_manager';
import { getIndex, getFormatValue } from './getFormatValues';

export const initStyle = async () => {
  // このページに対応するフォーマットがあれば適用
  applyFormats();
};

export const setFormatsAndPushToAry = (
  rules: Array<StyleRule>,
  prop: IPropsContext,
) => {
  const commands: CssCommand[] = [];
  for (const rule of rules) {
    for (const value of rule.values) {
      const c: CssCommand | null = setCommandGenerator(
        rule.cssSelector,
        value.key,
        value.value,
        rule.id,
        prop,
      );
      if (c) {
        commands.push(c);
      }
    }
  }
  if (commands.length > 0) {
    prop.executor.execute(new TemplateCommand(...commands));
  }
};

export type RemoveRule = {
  cssSelector: string;
  key: string;
  id: number | string;
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
  id: number | string | null,
  prop: IPropsContext,
) => {
  resta_console.log('setFormatAndPushToAry', cssSelector, key, value, id);
  if (!id) {
    id = 0;
  }
  if (!cssSelector) {
    resta_console.log(
      'setFormatAndPushToAry:invalid args, cssSelector is not found',
    );
    return;
  }
  if (!key && key !== '') {
    resta_console.log('setFormatAndPushToAry:invalid args, key is not found');
    return;
  }
  if (!value && value !== '') {
    resta_console.log('setFormatAndPushToAry:invalid args, value is not found');
    return;
  }
  const c = setCommandGenerator(cssSelector, key, value, id, prop);
  if (c) {
    prop.executor.execute(c);
  }
};

/**
 * 配列に対し、対応する要素を追加する
 * @param cssSelector
 * @param key
 * @param value
 * @param id
 * @param prop
 * @param index
 * @returns
 */
export const addFormat = (
  cssSelector: string | null,
  key: string | null,
  value: string | null,
  id: number | string | null,
  prop: IPropsContext,
  index?: number,
): void => {
  if (!cssSelector) {
    resta_console.warn('pushToAry:invalid args, cssSelector is not found');
    return;
  }
  if (!key) {
    resta_console.warn('pushToAry:invalid args, key is not found');
    return;
  }
  if (!value && value !== '') {
    resta_console.warn('pushToAry:invalid args, value is not found');
    return;
  }
  if (!id) {
    id = 0;
  }

  let currentTargetFormatBlock: FormatBlockByURL | undefined =
    prop.formatsArray.find((e) => e.url === prop.editedUrl);

  // 以下のif文は、各配列が存在しない場合に配列を作成する処理
  // すでに該当箇所への変更がある場合は書き換えている
  if (!currentTargetFormatBlock) {
    prop.formatsArray.push({ url: prop.editedUrl, formats: [] });
    currentTargetFormatBlock = prop.formatsArray.find(
      (e) => e.url === prop.editedUrl,
    );

    if (!currentTargetFormatBlock) {
      resta_console.error('addFormat: currentTargetFormatBlock is undefined');
      return;
    }
  }

  let currentFormat: Format | undefined = currentTargetFormatBlock.formats.find(
    (e) => e.cssSelector === cssSelector,
  );

  if (!currentFormat) {
    currentTargetFormatBlock.formats.push({
      cssSelector: cssSelector,
      changes: [],
    });
    currentFormat = currentTargetFormatBlock.formats.find(
      (e) => e.cssSelector === cssSelector,
    );
    if (!currentFormat) {
      resta_console.error('addFormat: currentFormat is undefined');
      return;
    }
  }

  let currentFormatChange: FormatChange | undefined =
    currentFormat.changes.find((e) => e.cssKey === key);

  if (!currentFormatChange) {
    currentFormat.changes.push({ cssKey: key, cssValues: [] });
    currentFormatChange = currentFormat.changes.find((e) => e.cssKey === key);
    if (!currentFormatChange) {
      resta_console.error('addFormat: currentFormatChange is undefined');
      return;
    }
  }

  const currentFormatStyleValue: FormatStyleValue | undefined =
    currentFormatChange.cssValues.find((e) => e.id === id);

  // 既に要素がある場合は取り除く。
  // この後、追加する
  if (currentFormatStyleValue) {
    const index = getIndex(cssSelector, key, id, prop);
    if (!(index == undefined || index === -1))
      currentFormatChange.cssValues.splice(index, 1);
  }

  // currentFormatChange.cssValuesに対し、idを入れる
  // この際、indexがあった場合はそのindexに入れる
  if (index == undefined) {
    currentFormatChange.cssValues.push({
      id: id,
      cssValue: value,
    } as FormatStyleValue);
  } else {
    currentFormatChange.cssValues.splice(index, 0, {
      id: id,
      cssValue: value,
    });
  }

  resta_console.log(
    'pushToAry',
    currentFormatChange.cssValues,
    prop.formatsArray,
  );
};

export const setCommandGenerator = (
  cssSelector: string,
  key: string,
  value: string,
  id: number | string,
  prop: IPropsContext,
): CssCommand => {
  // indexを検索する
  // idに対応する変更がすでにあったら、そのindexを返す
  const index = getIndex(cssSelector, key, id, prop);

  // 新しく追加する場合
  if (index == undefined || index === -1) {
    return {
      execute: () => {
        resta_console.log('execute:c', cssSelector, key, value, id);
        addFormat(cssSelector, key, value, id, prop);
        updateFormat(cssSelector, key, prop);
        saveFormat(prop);
      },
      undo: () => {
        resta_console.log('undo:c', cssSelector, key, value, id);
        deleteFormat(cssSelector, key, id, prop);
        updateFormat(cssSelector, key, prop);
        saveFormat(prop);
      },
    };
  } else {
    // すでにある場合、indexを指定して上書きする

    const oldValue = getFormatValue(cssSelector, key, id, prop);
    if (!oldValue) {
      resta_console.error('setCommandGenerator: oldValue is undefined');
      return {
        execute: () => {
          resta_console.log('execute:error', cssSelector, key, value, id);
          addFormat(cssSelector, key, value, id, prop);
          updateFormat(cssSelector, key, prop);
          saveFormat(prop);
        },
        undo: () => {
          resta_console.log('undo:error', cssSelector, key, value, id);
          deleteFormat(cssSelector, key, id, prop);
          updateFormat(cssSelector, key, prop);
          saveFormat(prop);
        },
      };
    }

    return {
      execute: () => {
        resta_console.log('execute:r', cssSelector, key, value, id);
        addFormat(cssSelector, key, value, id, prop);
        updateFormat(cssSelector, key, prop);
        saveFormat(prop);
      },
      undo: () => {
        resta_console.log('undo:r', cssSelector, key, value, id);
        addFormat(cssSelector, key, oldValue, id, prop, index);
        updateFormat(cssSelector, key, prop);
        saveFormat(prop);
      },
    };
  }
};

export const deleteCssCommandGenerator = (
  cssSelector: string,
  key: string,
  id: number | string,
  prop: IPropsContext,
): CssCommand | undefined => {
  const index = getIndex(cssSelector, key, id, prop);
  const oldValue = getFormatValue(cssSelector, key, id, prop);

  if (!oldValue) {
    resta_console.error('deleteCssCommandGenerator: oldValue is undefined');
    return undefined;
  }

  return {
    execute: () => {
      deleteFormat(cssSelector, key, id, prop);
      updateFormat(cssSelector, key, prop);
      saveFormat(prop);
    },
    undo: () => {
      addFormat(cssSelector, key, oldValue, id, prop, index);
      updateFormat(cssSelector, key, prop);
      saveFormat(prop);
    },
  };
};

/**
 * formatsArrayから変更内容を削除
 */
export const deleteFormat = (
  cssSelector: string,
  key: string,
  id: number | string,
  prop: IPropsContext,
): void => {
  const index = getIndex(cssSelector, key, id, prop);
  if (index == undefined || index === -1) {
    resta_console.warn('deleteFromAry: bug detected, index is ' + index);
    return;
  }

  const currentFormatChange = prop.formatsArray
    .find((e) => e.url === prop.editedUrl)
    ?.formats.find((e) => e.cssSelector === cssSelector)
    ?.changes.find((e) => e.cssKey === key);

  const deletedElem = currentFormatChange?.cssValues.splice(
    currentFormatChange?.cssValues.findIndex((e) => e.id === id) || 0,
    1,
  );

  if (!deletedElem) {
    resta_console.warn('deleteFromAry: bug detected, deletedElem is undefined');
    return;
  }
};

/**
 * formatsArrayに登録されているフォーマットを適用する
 * 比較的重い処理なので、ページ遷移時などに呼び出す
 */
export const applyFormats = () => {
  chrome.storage.local.get(['formats']).then((result) => {
    if (!result.formats) {
      resta_console.log('load:no format', currentUrl);
    } else {
      const formatsArray = (
        JSON.parse(result.formats) as Array<FormatBlockByURL>
      ).filter((e) => e.formats.length !== 0);
      resta_console.log('load', currentUrl, formatsArray);

      for (const f of formatsArray) {
        if (!matchUrl(currentUrl, f.url)) {
          continue;
        }

        // resta_console.log(f);
        for (const format of f.formats) {
          const cssSelector = format.cssSelector;
          setStyleRuleOnInit(
            {
              cssSelector: cssSelector,
              keys: format.changes
                .filter((e) => e.cssKey !== '' && e.cssValues.length !== 0)
                .map((e) => e.cssKey),
            },
            formatsArray,
          );
        }
      }
    }
  });
};

/**
 * CssSelectorとcssKeyの配列を渡すと、最新のスタイルを適用する
 * valueはいらない
 */
const setStyleRuleOnInit = (
  styles: {
    cssSelector: string;
    keys: Array<string>;
  },
  formatsArray: Array<FormatBlockByURL>,
) => {
  if (!styles.keys || !styles.cssSelector) {
    resta_console.log('setStyleRule: invalid value');
    return;
  }
  const styleSheet = getStyleSheet();
  // insertRuleが使えるかどうか
  // 使えない場合、つまり古いバージョンのChromeの場合はaddRuleを使う
  const canInsert = styleSheet.insertRule as
    | ((rule: string, index?: number) => number)
    | undefined;
  const formats = formatsArray
    .map((e) => e.formats)
    .filter((e) => e !== undefined)
    .map((e) => e.find((e) => e.cssSelector === styles.cssSelector))
    .filter((e) => e !== undefined);

  const rule = Array.from(styleSheet?.cssRules).find(
    (e) => e instanceof CSSStyleRule && e.selectorText === styles.cssSelector,
  ) as CSSStyleRule | undefined;

  if (rule) {
    for (const key of styles.keys) {
      const value = getDisplayedFormat(formats, key);
      if (!value) {
        resta_console.error(
          'formatter.setStyleRuleOnInit0: getDisplayFormat is false',
        );
        removeStyleRule(styles.cssSelector, key);
        continue;
      }
      if (rule.style.getPropertyValue(key) === value) continue;
      resta_console.log('setProperty');
      rule.style.setProperty(key, value);
    }
  } else {
    for (const key of styles.keys) {
      const value = getDisplayedFormat(formats, key);
      if (!value) {
        resta_console.error(
          'formatter.setStyleRuleOnInit1: getDisplayFormat is false',
        );
        removeStyleRule(styles.cssSelector, key);
      }
      if (canInsert) {
        styleSheet?.insertRule(
          `${styles.cssSelector}{${key}:${value}}`,
          styleSheet.cssRules.length,
        );
      } else {
        styleSheet?.addRule(
          styles.cssSelector,
          `${key}:${value}`,
          styleSheet.rules.length,
        );
      }
    }
  }
};
