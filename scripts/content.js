import { createXPathFromElement } from "./xpath_control.js";
import { setidDisplay } from "./id_display.js";
import { initStyle } from "./formatter.js";
import * as prop from "./prop.js";
import { elementSelector } from "./element_selector.js";

export const onLoad = () => {
  console.log("OnLoad");
  prop.setUrl(window.location.href);

  console.log("Init Style");
  initStyle();

  console.log("Set idDisplay");
  setidDisplay();

  document.body.appendChild(prop.idDisplay);
};

document.addEventListener("mouseover", () => {
  elementSelector();
});

// TODO: mouseoverが取れたらもともとのStyleに戻す (今はすべて空文字列に変えている) @K-Kazuyuki
let beforeStyle = undefined;
export const exchangeOverlapElementStyle = (prevElement, nextElement) => {
  if (nextElement) {
    if (prevElement) {
      prevElement.style = beforeStyle;
    }
    beforeStyle = nextElement.style;
  }
};
