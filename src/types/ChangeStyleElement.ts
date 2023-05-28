import {CSSParseResultElementType} from "./RestaSetting";

export type ChangeStyleCategoryMap = {[key: string]: ChangeStyleElement[]}

export type ChangeStyleElement = {
    name: string;
    description: string;
    parts: LayoutPart[];
    key: string;
    onChange: (key: string, value: string) => void;
}

export type LayoutPart = {
    type: CSSParseResultElementType;
    options?: string[];
    placeHolder?: string;
    defaultValue?: string | number;
    text?: string;
}