import { CSSParseResultElementType } from './RestaSetting';

export type PageSettingCategoryMap = { [key: string]: PageSettingElement[] };

export type PageSettingElement = {
  id: number;
  name: string;
  description: string;
  parts: LayoutPart[];
  key: string;
  onChange: (xPath: string, key: string, value: string) => void;
};

export type LayoutPart = {
  type: CSSParseResultElementType;
  options?: string[];
  placeHolder?: string;
  defaultValue?: string | number;
  text?: string;
};
