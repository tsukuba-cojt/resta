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
export let formatsAry:Array<any> = [];
export const setFormatsAry = (ary: Array<any>) => {
  formatsAry = ary;
};

export let clickedElement:HTMLElement;
export const setClickedElement = (element: HTMLElement) => {
  clickedElement = element;
};

export let overlapElement: HTMLElement;
export const setOverlapElement = (element: HTMLElement) => {
  overlapElement = element;
};

export const mouseoverColor:string = "rgba(0, 0, 255, 0.3)";
export const clickedColor: string = "rgba(255, 0, 0, 0.4)";

// idDisplayのDOMを格納する変数
export let idDisplay: HTMLElement;
export const setIdDisplay = (element: HTMLElement) => {
  idDisplay = element;
};
