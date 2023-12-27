import { Template, TemplateStyle } from '../types/Template';
import Parser from 'css-simple-parser';
import * as resta_console from './resta_console';
import { IPropsContext } from '../contexts/PropsContext';

export const loadUserTemplatesFromStorage = async (prop: IPropsContext) => {
  await chrome.storage.local.get(['userTemplates'], (result) => {
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
export const saveStyle = async (
  cssText: string,
  name = '',
  tags = ['all'],
  prop: IPropsContext,
) => {
  const template = createTemplateStyle(cssText, name, tags);
  const templates: Template[] = prop.userTemplates;
  const index = templates.findIndex((e) => e.name === name);
  // 既に同じ名前のテンプレートが存在する場合は、上書きする。
  if (index === -1) {
    templates.push(template);
  } else {
    templates[index] = template;
  }
  await saveUserTemplates(prop);
};

/**
 * テンプレートを削除する。
 * @param name
 * @param prop
 */
export const deleteStyle = async (name: string, prop: IPropsContext) => {
  const templates: Template[] = prop.userTemplates;
  const index = templates.findIndex((e) => e.name === name);
  if (index !== -1) {
    templates.splice(index, 1);
  }
  await saveUserTemplates(prop);
};

/**
 * 現在のuserTemplatesの状態をlocal storageに保存する。
 * @param templates
 */
const saveUserTemplates = async (prop: IPropsContext) => {
  chrome.storage.local.set({ userTemplates: prop.userTemplates });
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
  const ast = Parser.parse(removeSeparators(cssText));
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
      cssMap[key] = value;
    }

    const TemplateStyle: TemplateStyle = {
      pseudoClass: pseudoClass,
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
 * 文字列の改行コード等を削除する。
 * @param str
 * @returns
 */
const removeSeparators = (str: string): string => {
  return str.replace(/\s+/g, '');
};

/**
 * テスト用
 */
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
