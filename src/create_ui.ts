import * as prop from "./prop";
import { createXPathFromElement } from "./xpath_control";
import { setButtonDesign } from "./ui_design";
import { setFormatAndPushToAry } from "./formatter";
export const createToggleStyleButton = (key:string, onValue:string, offValue:string, iconChar:string)=>{
    const button = document.createElement("button") as HTMLElement;
    setButtonDesign(button);
    button.textContent = iconChar;

    button.onclick = async () => {
        if (prop.clickedElement) {
            const xpath = createXPathFromElement(prop.clickedElement);
            if (prop.clickedElement.style[key as any] === onValue) {
                setFormatAndPushToAry(xpath, key, offValue);
            } else {
                setFormatAndPushToAry(xpath, key, onValue);
            }
        }
    };
    return button;
}