import {
  StyleRule,
  getStyleSheet,
  removeStyleRule,
  setStyleRule,
} from './style_sheet';
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
      const c: CssCommand | null = pushToAry(
        rule.cssSelector,
        value.key,
        value.value,
        rule.id,
        prop,
      );
      setStyleRule(
        {
          cssSelector: rule.cssSelector,
          keys: [value.key],
        },
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
  saveFormat(prop);
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
  const c = await pushToAry(cssSelector, key, value, id, prop);
  if (c) {
    prop.executor.execute(c);
  }
  setStyleRule(
    {
      cssSelector: cssSelector,
      keys: [key],
    },
    prop,
  );
  saveFormat(prop);
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
  id: number | string | null,
  prop: IPropsContext,
): CssCommand | null => {
  if (!cssSelector) {
    resta_console.warn('pushToAry:invalid args, cssSelector is not found');
    return null;
  }
  if (!key) {
    resta_console.warn('pushToAry:invalid args, key is not found');
    return null;
  }
  if (!value && value !== '') {
    resta_console.warn('pushToAry:invalid args, value is not found');
    return null;
  }
  if (!id) {
    id = 0;
  }

  let currentTargetFormatBlock: FormatBlockByURL | undefined =
    prop.formatsArray.find((e) => e.url === prop.editedUrl);

  // 以下のif文は、各配列が存在しない場合に配列を作成する処理
  // すでに該当箇所への変更がある場合は書き換えている
  if (currentTargetFormatBlock == null) {
    currentTargetFormatBlock = { url: prop.editedUrl, formats: [] };
    prop.formatsArray.push(currentTargetFormatBlock);
  }

  let currentFormat: Format | undefined = currentTargetFormatBlock.formats.find(
    (e) => e.cssSelector === cssSelector,
  );

  if (currentFormat == null) {
    currentFormat = { cssSelector: cssSelector, changes: [] };
    currentTargetFormatBlock.formats.push(currentFormat);
  }

  let currentFormatChange: FormatChange | undefined =
    currentFormat.changes.find((e) => e.cssKey === key);

  if (currentFormatChange == null) {
    currentFormatChange = { cssKey: key, cssValues: [] };
    currentFormat.changes.push({ cssKey: key, cssValues: [] });
  }

  const currentFormatStyleValue: FormatStyleValue | undefined =
    currentFormatChange.cssValues.find((e) => e.id === id);

  if (currentFormatStyleValue == null) {
    // idに対応する要素を追加する
    currentFormatChange.cssValues.push({ id: id, cssValue: value });

    // resta_console.log('pushToAry:push', cssSelector, key, value);
    return {
      execute: () => {
        pushToAry(cssSelector, key, value, id, prop);
        updateFormat(cssSelector, key, prop);
      },
      undo: () => {
        deleteFromAry(cssSelector, key, 0, prop);
        updateFormat(cssSelector, key, prop);
      },
    };
  } else {
    // すでにidに対応する要素がある場合
    // その要素を削除して末尾に追加する
    const index = getIndex(cssSelector, key, id, prop);
    if (index == undefined || index === -1) {
      resta_console.warn('pushToAry: bug detected, index is undefined');
    }

    // idに対応する要素を取り除く
    const log = currentFormatChange.cssValues.splice(
      currentFormatChange.cssValues.findIndex((e) => e.id === id) || 0,
      1,
    );

    // idに対応する要素を追加する
    // これにより、idに対応する要素が最後尾に移動する
    currentFormatChange.cssValues.push({ id: id, cssValue: value });

    return {
      execute: () => {
        pushToAry(cssSelector, key, value, id, prop);
        updateFormat(cssSelector, key, prop);
      },
      undo: () => {
        pushToAry(cssSelector, key, log ? log[0].cssValue : '', id, prop);
        updateFormat(cssSelector, key, prop);
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

  resta_console.log('deleteFromAry', prop.formatsArray);

  // TODO: index処理どこいった？
  prop.executor.execute({
    execute: () => {
      deleteFromAry(cssSelector, key, id, prop);
      updateFormat(cssSelector, key, prop);
    },
    undo: () => {
      pushToAry(cssSelector, key, deletedElem[0].cssValue, id, prop);
      updateFormat(cssSelector, key, prop);
    },
  });

  saveFormat(prop);
};

/**
 * 要素の、cssSelectorに対するスタイルスタックのindexを返す
 * 要素がない場合はundefinedを返す
 */
const getIndex = (
  cssSelector: string,
  key: string,
  id: number | string,
  prop: IPropsContext,
): number | undefined => {
  return prop.formatsArray
    .find((e) => matchUrl(prop.editedUrl, e.url))
    ?.formats.find((e) => e.cssSelector === cssSelector)
    ?.changes.find((e) => e.cssKey === key)
    ?.cssValues.findIndex((e) => e.id === id);
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
