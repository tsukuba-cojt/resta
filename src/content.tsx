// import {setidDisplay} from "./id_display";
import {initStyle} from "./formatter";
import * as prop from "./prop";
import {elementSelector} from "./element_selector";
import React from "react";
import ReactDOM from "react-dom";
import Base from "./components/Base";
import loadRestaSetting from "./feature/setting_loader";

export const onLoad = () => {
    console.log("OnLoad");
    prop.setUrl(window.location.href);

    console.log("Init Style");
    initStyle();

    console.log("Load Resta Setting");

    // console.log("Set idDisplay");
    // setidDisplay();

    (async () => {
        const categoryMap = await loadRestaSetting();

        const div = document.createElement("div");
        div.setAttribute("id", "resta-root");
        document.body.insertAdjacentElement("beforeend", div);

        ReactDOM.render(
            <React.StrictMode>
                <Base categoryMap={categoryMap}/>
            </React.StrictMode>,
            document.getElementById('resta-root')
        );
    })();

    // document.body.appendChild(prop.idDisplay);
};

document.addEventListener("mouseover", () => {
    elementSelector();
});

// TODO: mouseoverが取れたらもともとのStyleに戻す (今はすべて空文字列に変えている) @K-Kazuyuki
