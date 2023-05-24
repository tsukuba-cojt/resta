import { createXPathFromElement } from "./xpathcontrol.js";
import { setidDisplay } from "./idDisplay.js";
import { initStyle } from "./formatter.js";
import * as prop from "./prop.js";
import { elementSelector } from "./elementSelector.js";

export const OnLoad = () => {
  console.log("OnLoad");
  prop.setUrl(window.location.href);
  initStyle();
  console.log("Init Style");

  setidDisplay();
  console.log("Set idDisplay");

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
