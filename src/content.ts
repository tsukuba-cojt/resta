import { setidDisplay } from "./id_display";
import { initStyle } from "./formatter";
import * as prop from "./prop";
import { elementSelector } from "./element_selector";

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
