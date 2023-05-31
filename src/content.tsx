// import {setidDisplay} from "./id_display";
import {initStyle} from "./formatter";
import * as prop from "./prop";
import React from "react";
import ReactDOM from "react-dom";
import Base from "./components/Base";
import loadRestaSetting from "./features/setting_loader";
import ElementSelector from "./features/ElementSelector";

export const onLoad = () => {
    console.log("OnLoad");
    prop.setUrl(window.location.href);

    // console.log("Set idDisplay");
    // setidDisplay();

    (async () => {
        console.log("Init Style");
        await initStyle();

        console.log("Load Resta Setting");
        const categoryMap = await loadRestaSetting();

        const div = document.createElement("div");
        div.setAttribute("id", "resta-root");
        document.body.insertAdjacentElement("beforeend", div);

        ReactDOM.render(
            <React.StrictMode>
                <Base categoryMap={categoryMap}/>
                <ElementSelector/>
            </React.StrictMode>,
            document.getElementById('resta-root')
        );
    })();

    // document.body.appendChild(prop.idDisplay);
};

/*
document.addEventListener("mouseover", () => {
    elementSelector();
});

 */

// TODO: mouseoverが取れたらもともとのStyleに戻す (今はすべて空文字列に変えている) @K-Kazuyuki
