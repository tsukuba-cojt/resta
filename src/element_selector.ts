import * as prop from "./prop";
import { createXPathFromElement } from "./xpath_control";
export const elementSelector = () => {
  const hovers:NodeListOf<HTMLElement> = document.querySelectorAll(":hover");
  let minSize = 100000;
  let minElement = undefined;
  // console.log(Array.from(hovers).filter((e) => e.tagName !== "TEXTAREA"));
  for (const hover of Array.from(hovers).filter(
    (e) => e.tagName !== "textarea"
  )) {
    if (hover.dataset.noselect !== "true") {
      const rect = hover.getBoundingClientRect();
      const size = rect.width * rect.height;
      if (size < minSize) {
        minElement = hover;
      }
    }
  }

  if (!minElement || minElement.tagName === "TEXTAREA") {
    return;
  }

  if (
    minElement !== prop.overlapElement &&
    !minElement.closest("#resta-root")
  ) {
    if (prop.overlapElement && prop.overlapElement !== prop.clickedElement) {
      if (prop.overlapElement.tagName === "IMG") {
        prop.overlapElement.style.border = "";
      } else {
        prop.overlapElement.style.background = "";
      }
    }

    if (minElement) {
      if (minElement.tagName === "IMG") {
        minElement.style.border = "2px solid " + prop.mouseoverColor;
      } else {
        minElement.style.background = prop.mouseoverColor;
      }
    }
    prop.setOverlapElement(minElement);

    prop.overlapElement.addEventListener("mousedown", () => {
      if (prop.overlapElement.tagName === "IMG") {
        prop.overlapElement.style.border = "2px solid " + prop.clickedColor;
      } else {
        prop.overlapElement.style.background = prop.clickedColor;
      }

      if (prop.clickedElement && prop.clickedElement !== prop.overlapElement) {
        if (prop.clickedElement.tagName === "IMG") {
          prop.clickedElement.style.border = "";
        } else {
          prop.clickedElement.style.background = "";
        }
      }
      prop.setClickedElement(prop.overlapElement);
      const xpath = createXPathFromElement(prop.clickedElement);
      console.log("xpath:" + xpath);
    });
  }
};
