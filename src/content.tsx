import { setidDisplay } from "./id_display";
import { initStyle } from "./formatter";
import * as prop from "./prop";
import { elementSelector } from "./element_selector";
import React from "react";
import ReactDOM from "react-dom";
import Base from "./components/Base";

export const onLoad = () => {
  console.log("OnLoad");
  prop.setUrl(window.location.href);

  console.log("Init Style");
  initStyle();

  console.log("Set idDisplay");
  setidDisplay();



  const div = document.createElement("div");
  div.setAttribute("id", "resta-root");
  document.body.insertAdjacentElement("beforeend", div);



  ReactDOM.render(
      <React.StrictMode>
        <Base />
      </React.StrictMode>,
      document.getElementById('resta-root')
  );

  // document.body.appendChild(prop.idDisplay);
};

document.addEventListener("mouseover", () => {
  elementSelector();
});

// TODO: mouseoverが取れたらもともとのStyleに戻す (今はすべて空文字列に変えている) @K-Kazuyuki
