export type RestaStyles = {
  styles: RestaStyle[];
  templates: RestaStyle[];
  categories: RestaCategory[];
};

export type RestaStyle = {
  id: number;
  name: string;
  description: string;
  category: string;
  iconChar: string; // TODO
  filter: string[];
  css: RestaSettingCSS;
};

export type RestaCategory = {
  id: string;
  name: string;
};

export type RestaSettingCSS = { [key in keyof CSSStyleDeclaration]: string };

export type CSSParseResult = CSSParseResultElement[];

export enum CSSParseResultElementType {
  SELECT = 'select',
  TOGGLE = 'toggle',
  STRING = 'string',
  NUMBER = 'number',
  COLOR = 'color',
  RAWTEXT = 'rawtext',
}

export namespace CSSParseResultElementType {
  export const fromName = (
    name: string
  ): CSSParseResultElementType | undefined => {
    switch (name) {
      case 'select':
        return CSSParseResultElementType.SELECT;
      case 'toggle':
        return CSSParseResultElementType.TOGGLE;
      case 'string':
        return CSSParseResultElementType.STRING;
      case 'number':
        return CSSParseResultElementType.NUMBER;
      case 'color':
        return CSSParseResultElementType.COLOR;
      case 'rawtext':
        return CSSParseResultElementType.RAWTEXT;
      default:
        return undefined;
    }
  };
}

export type CSSParseResultElement = {
  type: CSSParseResultElementType;
  options?: string[];
  text?: string;
};
