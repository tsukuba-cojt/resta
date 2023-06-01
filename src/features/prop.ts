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

// スタイル変更の配列を格納する変数
export let formatsAryOld: Array<any> = [];
export const setFormatsAry = (ary: Array<any>) => {
  formatsAryOld = ary;
};

export const formatsArray: Array<Format> = [];

export type Format = {
  xpath: string;
  changes: Array<FormatChange>;
};

export type FormatChange = {
  key: string;
  values: Array<FormatStyleValue>;
};

export type FormatStyleValue = {
  id: number;
  value: string;
};
