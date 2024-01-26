import { Template, TemplateStyle } from '../types/Template';
import Parser from 'css-simple-parser';
import { IPropsContext } from '../contexts/PropsContext';
import { log } from './resta_console';
import t from './translator';

export const loadUserTemplatesFromStorage = async (prop: IPropsContext) => {
  chrome.storage.local.get(['userTemplates'], (result) => {
    if (!result.userTemplates) {
      prop.setUserTemplates([]);
    } else {
      prop.setUserTemplates(result.userTemplates);
    }
  });
};

/**
 * テンプレートを保存する
 * @param cssText cssのテキスト
 * @param name このテンプレートの名前
 * @param tags 適用させるタグ。['all']の場合は全てのタグに適用される。
 */
export const saveUserTemplates = async (
  cssText: string,
  name = '',
  tags = ['all'],
  prop: IPropsContext,
) => {
  const template = createTemplateStyle(cssText, name, tags);
  const templates: Template[] = [...prop.userTemplates];
  const index = templates.findIndex((e) => e.name === name);
  // 既に同じ名前のテンプレートが存在する場合は、上書きする。
  if (index === -1) {
    templates.push(template);
  } else {
    templates[index] = template;
  }
  await saveUserTemplatesLocal(templates, prop);
};

/**
 * テンプレートを削除する。
 * @param name
 * @param prop
 */
export const deleteUserTemplates = async (
  name: string,
  prop: IPropsContext,
) => {
  const templates: Template[] = [...prop.userTemplates];
  const index = templates.findIndex((e) => e.name === name);
  if (index !== -1) {
    templates.splice(index, 1);
  }
  await saveUserTemplatesLocal(templates, prop);
};

export const deleteAllUserTemplates = async (prop: IPropsContext) => {
  await saveUserTemplatesLocal([], prop);
  // ページをリロード
  window.location.reload();
};

/**
 * 現在のuserTemplatesの状態をlocal storageに保存する。
 * @param templates
 */
const saveUserTemplatesLocal = async (
  newTemplates: Template[],
  prop: IPropsContext,
) => {
  prop.setUserTemplates(newTemplates);
  chrome.storage.local.set({ userTemplates: newTemplates });
};

/**
 * cssTextからTemplateを作成する。
 * @param cssText
 * @param name
 * @param tags
 * @returns
 */
const createTemplateStyle = (
  cssText: string,
  name: string,
  tags: string[],
): Template => {
  const styles: TemplateStyle[] = [];
  // background: #27acd9; のような単純なcssの場合は、css-simple-parserが解析できない
  // そのため、その場合は1行ずつ分割するのみとする。
  if (cssText.includes('{')) {
    const ast = Parser.parse(removeSeparators(cssText));
    log('ast', ast);
    if (ast.children.length === 0) throw new Error(t('css-parse-error'));
    for (const child of ast.children) {
      const pseudoClass = child.selector.split(':')[1];
      const css: string[] = child.body
        .trim()
        .split(';')
        .filter((e) => e !== '');
      if (css.length === 0) continue;

      const cssMap: { [key: string]: string } = {};

      for (const c of css) {
        const [key, value] = c.split(':');
        cssMap[key.trim()] = value.trim();
      }

      const TemplateStyle: TemplateStyle = {
        pseudoClass: pseudoClass,
        css: cssMap,
      };
      styles.push(TemplateStyle);
    }
  } else {
    const css: string[] = cssText
      .trim()
      .split(';')
      .filter((e) => e !== '');
    if (css.length === 0) throw new Error(t('css-parse-error'));
    const cssMap: { [key: string]: string } = {};

    for (const c of css) {
      const [key, value] = c.split(':');
      cssMap[key.trim()] = value.trim();
    }

    const TemplateStyle: TemplateStyle = {
      pseudoClass: '',
      css: cssMap,
    };
    styles.push(TemplateStyle);
  }
  if (tags.length === 0) tags.push('all');
  const template: Template = {
    name: name,
    tags: tags,
    styles: styles,
    isPage: false,
  };
  return template;
};

/**
 * TemplateからcssTextを作成する。
 * @param styles
 * @returns
 */
export const templateStyleToCssText = (styles: TemplateStyle[]): string => {
  // pseudoClassを持たないブロックのみが存在する場合、波括弧で囲わない
  const noBlock = styles.length === 1 && !styles[0].pseudoClass;
  const blocks: string[] = [];

  for (const style of styles) {
    const properties = Object.entries(style.css)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');
    if (noBlock) {
      blocks.push(properties);
    } else {
      const selector = style.pseudoClass ? `:${style.pseudoClass}` : '';
      blocks.push(`${selector} {
  ${properties}
}`);
    }
  }

  return blocks.join('\n\n');
};

/**
 * 文字列の改行コード等を削除する。
 * @param str
 * @returns
 */
const removeSeparators = (str: string): string => {
  return str.replace(/\s+/g, '');
};

/*
// テスト用
export const testCssParse = () => {
  resta_console.log(
    'testCssParse1',
    createTemplateStyle(testCssButtonDesign, 'test', ['button']),
  );
  resta_console.log(
    'testCssParse2',
    createTemplateStyle(testCssButtonDesign1, 'test1', ['button']),
  );
};

const testCssButtonDesign: string = `
a.btn_06 {
	display: block;
  text-align: center;
}
a.btn_06:hover {
	margin-top: 6px;
}
`;

const testCssButtonDesign1: string = `
a.btn_06 {
	display: block;
	text-align: center;
	vertical-align: middle;
	text-decoration: none;
	width: 120px;
	margin: auto;
	padding: 1rem 4rem;
	font-weight: bold;
	border-radius: 100vh;
	border-bottom: 7px solid #0686b2;
	background: #27acd9;
	color: #fff;
}
a.btn_06:hover {
	margin-top: 6px;
	border-bottom: 1px solid #0686b2;
	color: #fff;
}
`;
*/
