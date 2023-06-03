// 現在のURLを格納する変数
export let currentUrl: string;
export const setUrl = (url: string) => {
  currentUrl = url;
  edittedUrl = url;
};

// スタイル変更編集中のURLを格納する変数
// tsukuba.mast.ac.jp/* などのワイルドカードを含むURLを格納することもできる
export let edittedUrl: string;
export const setEdittedUrl = (url: string) => {
  edittedUrl = url;
};

export let formatsArray: Array<FormatBlockByURL> = [];
export const setFormatsAry = (ary: Array<FormatBlockByURL>) => {
  formatsArray = ary;
};

export type FormatBlockByURL = {
  url: string;
  formats: Array<Format>;
};

export type Format = {
  cssSelector: string;
  changes: Array<FormatChange>;
};

export type FormatChange = {
  cssKey: string;
  cssValues: Array<FormatStyleValue>;
};

export type FormatStyleValue = {
  id: number;
  cssValue: string;
};
