import { setIdDisplayDesign, setButtonDesign } from "./ui_design";
import { createXPathFromElement } from "./xpath_control";
import { setFormatAndPushToAry, saveFormat } from "./formatter";
import * as prop from "./prop";
export const setidDisplay = () => {
  prop.setIdDisplay(document.createElement("div"));
  prop.idDisplay.id = "ReDesignIdDisplay";
  setIdDisplayDesign(prop.idDisplay);

  const boldButton = document.createElement("button");
  setButtonDesign(boldButton);
  boldButton.textContent = "B";
  boldButton.style.fontWeight = "bold";
  boldButton.onclick = async () => {
    if (prop.clickedElement) {
      const xpath = createXPathFromElement(prop.clickedElement);
      if (prop.clickedElement.style.fontWeight === "bold") {
        setFormatAndPushToAry(xpath, "fontWeight", "normal");
      } else {
        setFormatAndPushToAry(xpath, "fontWeight", "bold");
      }
    }
  };
  prop.idDisplay.appendChild(boldButton);

  const italicButton = document.createElement("button");
  setButtonDesign(italicButton);
  italicButton.textContent = "I";
  italicButton.style.fontStyle = "italic";
  italicButton.onclick = async () => {
    if (prop.clickedElement) {
      const xpath = createXPathFromElement(prop.clickedElement);
      if (prop.clickedElement.style.fontStyle === "italic") {
        setFormatAndPushToAry(xpath, "fontStyle", "normal");
      } else {
        setFormatAndPushToAry(xpath, "fontStyle", "italic");
      }
    }
  };
  prop.idDisplay.appendChild(italicButton);

  const textarea = document.createElement("textarea");
  textarea.style.width = "90%";
  textarea.onkeydown = () => {
    const property = textarea.value.split(":")[0];
    const value = textarea.value.split(":")[1];
    if (prop.clickedElement) {
      prop.clickedElement.style.setProperty(property, value);
    }
  };
  prop.idDisplay.appendChild(textarea);

  const saveButton = document.createElement("button");
  setButtonDesign(saveButton);
  saveButton.textContent = "💾";
  saveButton.onclick = async () => {
    const xpath = createXPathFromElement(prop.clickedElement);
    console.log("xpath:" + xpath);
    saveFormat();
  };
  prop.idDisplay.appendChild(saveButton);
};
