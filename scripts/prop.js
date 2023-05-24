export let currentUrl;
export const setUrl = (url) => {
  currentUrl = url;
  edittedUrl = url;
};

export let edittedUrl;
export const setEdittedUrl = (url) => {
  edittedUrl = url;
};

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
export const clickedColor = "rgba(255,0,0,0.4)";

export let idDisplay = undefined;
export const setIdDisplay = (element) => {
  idDisplay = element;
};
