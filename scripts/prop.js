// 現在のURLを格納する変数
export let currentUrl;
export const setUrl = (url) => {
  currentUrl = url;
  edittedUrl = url;
};

// スタイル変更編集中のURLを格納する変数
// tsukuba.mast.ac.jp/* などのワイルドカードを含むURLを格納することもできる
export let edittedUrl;
export const setEdittedUrl = (url) => {
  edittedUrl = url;
};

// スタイル変更の配列を格納する変数
export let formatsAry = [];
export const setFormatsAry = (ary) => {
  formatsAry = ary;
};

export let clickedElement = undefined;
export const setClickedElement = (element) => {
  clickedElement = element;
};

export let overlapElement = undefined;
export const setOverlapElement = (element) => {
  overlapElement = element;
};

export const mouseoverColor = "rgba(0, 0, 255, 0.3)";
export const clickedColor = "rgba(255, 0, 0, 0.4)";

// idDisplayのDOMを格納する変数
export let idDisplay = undefined;
export const setIdDisplay = (element) => {
  idDisplay = element;
};
