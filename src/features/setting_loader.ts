import {
  ChangeStyleCategoryMap,
  LayoutPart,
} from '../types/ChangeStyleElement';
import {
  CSSParseResult,
  CSSParseResultElementType,
  RestaStyle,
} from '../types/RestaSetting';
import { downloadUiSetting } from './setting_downloader';

export const loadRestaSetting = async (): Promise<ChangeStyleCategoryMap> => {
  const styles = await downloadUiSetting();
  console.log('uiSetting', styles);
  return loadRestaSettingStyles(styles);
};

const loadRestaSettingStyles = (
  styles: RestaStyle[]
): ChangeStyleCategoryMap => {
  const categories: ChangeStyleCategoryMap = {};

  styles.forEach((style) => {
    const elements = categories[style.category]
      ? categories[style.category]
      : [];
    const firstCSS = Object.entries(style.css)[0];
    const parts: LayoutPart[] = [];

    parse(firstCSS[1]).forEach((parseResultElement) =>
      parts.push({
        type: parseResultElement.type,
        options: parseResultElement.options,
        text: parseResultElement.text,
      })
    );

    elements.push({
      id: style.id,
      name: style.name,
      description: style.description,
      key: firstCSS[0],
      parts: parts,
      onChange: (xPath, key, value) => {
        console.log(xPath, key, value); // TODO to apply format
      },
    });

    categories[style.category] = elements;
  });

  return categories;
};

/**
 * 特殊な記法で書かれたRestaSettingのcssのvalueをパースする
 *
 * pseudo BNF:
 * value   ::= element | element ":" value
 * element ::= select | input | rawtext
 * select  ::= "<" items ">"
 * items   ::= item | item "|" items
 * item    ::= \w+
 * input   ::= # ("number" | "color" | "text")
 * rawtext ::= \w+
 *
 * @param cssValue
 */
const parse = (cssValue: string): CSSParseResult => {
  const result: CSSParseResult = [];
  let index = 0;

  // 一文字ずつみていく
  while (index < cssValue.length) {
    let lexime = cssValue[index++];
    let type: CSSParseResultElementType = CSSParseResultElementType.RAWTEXT;
    let options: string[] | undefined;
    let text: string | undefined;

    switch (lexime) {
      case '<': {
        type = CSSParseResultElementType.SELECT;
        lexime = '';

        do {
          lexime += cssValue[index++];
        } while (index < cssValue.length && cssValue[index] !== '>');

        // いまの value[index] は '>' なので、index を 2 進める
        index += 2;

        options = lexime.split('|');
        break;
      }

      case '#': {
        lexime = '';

        do {
          lexime += cssValue[index++];
        } while (index < cssValue.length && cssValue[index] !== ':');

        index++;

        const tmpType = CSSParseResultElementType.fromName(lexime);
        if (!tmpType) {
          console.log(
            'Error(parse_to_elements.ts): Invalid input type',
            lexime
          );
          break;
        }
        type = tmpType;
        break;
      }

      default: {
        do {
          lexime += cssValue[index++];
        } while (index < cssValue.length && cssValue[index] !== ':');

        index++;
        text = lexime;
      }
    }

    result.push({
      type: type,
      options: options,
      text: text,
    });
  }

  return result;
};

export default loadRestaSetting;
