let overlapMarker = undefined;
let overlapElement = undefined;
let clickedElement = undefined;

window.addEventListener("load", () => {
  const idDisplay = document.createElement("div");
  idDisplay.id = "ReDesignIdDisplay";
  idDisplay.style.width = "300px";
  idDisplay.style.height = "100%";
  idDisplay.style.position = "fixed";
  idDisplay.style.bottom = 0;
  idDisplay.style.right = 0;
  idDisplay.style.boxShadow = "0 2px 4px rgba(0,0,0,0.4)";
  idDisplay.style.background = "#fff";
  idDisplay.style.zIndex = 100000;

  const idDisplayMoveButtonToR = document.createElement("button");
  // divタグの中央左に配置
  idDisplayMoveButtonToR.style.position = "absolute";
  idDisplayMoveButtonToR.style.top = "50%";
  idDisplayMoveButtonToR.style.left = 0;
  idDisplayMoveButtonToR.style.transform = "translate(0, -50%)";
  idDisplayMoveButtonToR.textContent = ">";
  idDisplayMoveButtonToR.onclick = () => {
    idDisplay.style.right = "";
    idDisplay.style.left = "0";
    idDisplayMoveButtonToR.style.left = "";
    idDisplayMoveButtonToL.style.left = "0";
    idDisplayMoveButtonToL.style.right = "";
    idDisplayMoveButtonToR.style.right = "0";
  };
  setButtonDesign(idDisplayMoveButtonToR);

  const idDisplayMoveButtonToL = document.createElement("button");
  // divタグの中央右に配置
  idDisplayMoveButtonToL.style.position = "absolute";
  idDisplayMoveButtonToL.style.top = "50%";
  idDisplayMoveButtonToL.style.right = 0;
  idDisplayMoveButtonToL.style.transform = "translate(0, -50%)";
  idDisplayMoveButtonToL.textContent = "<";
  idDisplayMoveButtonToL.onclick = () => {
    idDisplay.style.left = "";
    idDisplay.style.right = "0";
    idDisplayMoveButtonToL.style.right = "";
    idDisplayMoveButtonToR.style.right = "";
    idDisplayMoveButtonToR.style.left = "0";
    idDisplayMoveButtonToL.style.left = "";
  };
  setButtonDesign(idDisplayMoveButtonToL);

  const boldButton = document.createElement("button");
  setButtonDesign(boldButton);
  boldButton.textContent = "B";
  boldButton.style.fontWeight = "bold";
  boldButton.onclick = async () => {
    if (clickedElement) {
      if (clickedElement.style.fontWeight === "bold") {
        clickedElement.style.fontWeight = "normal";
      } else {
        clickedElement.style.fontWeight = "bold";
      }
    }
  };
  idDisplay.appendChild(boldButton);

  const italicButton = document.createElement("button");
  setButtonDesign(italicButton);
  italicButton.textContent = "I";
  italicButton.style.fontStyle = "italic";
  italicButton.onclick = async () => {
    if (clickedElement) {
      if (clickedElement.style.fontStyle === "italic") {
        clickedElement.style.fontStyle = "normal";
      } else {
        clickedElement.style.fontStyle = "italic";
      }
    }
  };
  idDisplay.appendChild(italicButton);

  const textarea = document.createElement("textarea");
  textarea.style.width = "90%";
  textarea.onkeydown = () => {
    const property = textarea.value.split(":")[0];
    const value = textarea.value.split(":")[1];
    if (clickedElement) {
      clickedElement.style[property] = value;
    }
  };
  idDisplay.appendChild(textarea);
  document.body.appendChild(idDisplay);
});

document.addEventListener("mouseover", () => {
  const hovers = document.querySelectorAll(":hover");
  let minSize = 100000;
  let minElement = undefined;
  console.log(Array.from(hovers).filter((e) => e.tagName !== "TEXTAREA"));
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

  /*if (minElement.tagName === 'textarea') {
    return;
  }*/

  if (
    minElement !== overlapElement &&
    !minElement.closest("#ReDesignIdDisplay")
  ) {
    if (overlapElement && overlapElement !== clickedElement) {
      overlapElement.style.background = "";
    }
    if (minElement) {
      minElement.style.background = "rgba(255,255,0,0.4)";
    }
    overlapElement = minElement;

    overlapElement.addEventListener("mousedown", () => {
      overlapElement.style.background = "rgba(255,0,0,0.4)";
      if (clickedElement && clickedElement !== overlapElement) {
        clickedElement.style.background = "";
      }
      clickedElement = overlapElement;
    });
  }
});

const setButtonDesign = (button) => {
  button.style.width = "30px";
  button.style.height = "30px";
  button.style.borderRadius = "5px";
  button.style.background = "#fff";
  button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.4)";
  button.style.margin = "5px";
};
