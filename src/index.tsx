import * as prop from "./features/prop";
import {initStyle} from "./features/formatter";
import loadRestaSetting from "./features/setting_loader";
import ReactDOM from "react-dom";
import React from "react";
import Base from "./components/Base";
import ElementSelector from "./features/ElementSelector";

window.addEventListener('load', () => {
    console.log("OnLoad");
    prop.setUrl(window.location.href);

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
});