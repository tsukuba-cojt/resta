import { Template } from '../types/Template';
import Parser from 'css-simple-parser';

/**
 * cssTextからテンプレートスタイルを作成する。
 * 既に同じnameのテンプレートが存在する場合は、上書きする。
 * @param cssText
 */
export const saveStyle = async (cssText: string, name = '') => {
  const template = createTemplateStyle(cssText, name, []);
  const templates: Template[] = await getTemplates();
  const index = templates.findIndex((e) => e.name === name);
  // 既に同じ名前のテンプレートが存在する場合は、上書きする。
  if (index === -1) {
    templates.push(template);
  } else {
    templates[index] = template;
  }
  await saveTemplates(templates);
};

const getTemplates = async (): Promise<any> => {
  chrome.storage.local.get(['userTemplates'], (result) => {
    if (!result.userTemplates) {
      return [];
    } else {
      return result.userTemplates;
    }
  });
};

const saveTemplates = async (templates: Template[]) => {
  chrome.storage.local.set({ userTemplates: templates });
};

/**
 * cssTextからテンプレートスタイルを作成する。
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
  const template: Template = {
    name,
    tags,
    styles: [],
  };
  const ast = Parser.parse(cssText);
  return template;
};
