// 現在のURLを格納する変数
export let currentUrl: string;
export const setUrl = (url: string) => {
  const urlObj = new URL(url);
  currentUrl = urlObj.origin + urlObj.pathname;
  edittedUrl = currentUrl;
};

// スタイル変更編集中のURLを格納する変数
// tsukuba.mast.ac.jp/* などのワイルドカードを含むURLを格納することもできる
export let edittedUrl: string;
export const setEdittedUrl = (url: string) => {
  console.log('setEdittedUrl', url);
  edittedUrl = url;
};

export let formatsArray: Array<FormatBlockByURL> = [];
export const setFormatsAry = (ary: Array<FormatBlockByURL>) => {
  formatsArray = ary;
};
export const removeAllFormats = () => {
  formatsArray.splice(0, formatsArray.length);
  console.log('resetFormatsAry', formatsArray);
};

export const removeCurrentFormat = () => {
  const index = formatsArray.findIndex((x) => x.url === currentUrl);
  if (index !== -1) {
    formatsArray.splice(index, 1);
  }
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

export const getValue = (cssValues: Array<FormatStyleValue> | undefined) => {
  if (!cssValues || cssValues.length === 0) {
    return '';
  }
  return cssValues[cssValues.length - 1].cssValue || '';
};
