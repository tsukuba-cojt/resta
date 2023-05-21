let overlapMarker = undefined;
let overlapElement = undefined;
let clickedElement = undefined;
let currentUrl = undefined;
const clickedColor = "rgba(255,0,0,0.4)";
const mouseoverColor = "rgba(0,0,255,0.4)";

const format = {
  format: [
    {
      xpath: 'id("top-box-wrapper")/div[4]/p[1]',
      styles: [{ background: "rgba(255,0,0,0.4)" }],
    },
  ],
};

window.addEventListener("load", () => {
  currentUrl = window.location.href;
  loadFormat();
  // const xpath = "/HTML/BODY[2]/DIV[1]/DIV[3]/DIV[2]/DIV[1]/DIV[2]/DL[1]/DD[16]";
  const xpath = 'id("top-box-wrapper")/div[4]/p[1]';
  var xpathResult = getElementByXpath(xpath);
  xpathResult.style.background = "rgba(255,0,0,0.4)";

  const idDisplay = document.createElement("div");
  idDisplay.id = "ReDesignIdDisplay";
  setIdDisplayDesign(idDisplay);

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

  const saveButton = document.createElement("button");
  setButtonDesign(saveButton);
  saveButton.textContent = "Save";
  saveButton.onclick = async () => {
    const xpath = createXPathFromElement(clickedElement);
    console.log("xpath:" + xpath);
    saveFormat();
  };
  idDisplay.appendChild(saveButton);

  document.body.appendChild(idDisplay);
});

document.addEventListener("mouseover", () => {
  const hovers = document.querySelectorAll(":hover");
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
    minElement !== overlapElement &&
    !minElement.closest("#ReDesignIdDisplay")
  ) {
    if (overlapElement && overlapElement !== clickedElement) {
      if (overlapElement.tagName === "IMG") {
        overlapElement.style.border = "";
      } else {
        overlapElement.style.background = "";
      }
    }

    if (minElement) {
      if (minElement.tagName === "IMG") {
        minElement.style.border = "2px solid " + mouseoverColor;
      } else {
        minElement.style.background = mouseoverColor;
      }
    }
    overlapElement = minElement;

    overlapElement.addEventListener("mousedown", () => {
      if (overlapElement.tagName === "IMG") {
        overlapElement.style.border = "2px solid " + clickedColor;
      } else {
        overlapElement.style.background = clickedColor;
      }

      if (clickedElement && clickedElement !== overlapElement) {
        if (clickedElement.tagName === "IMG") {
          clickedElement.style.border = "";
        } else {
          clickedElement.style.background = "";
        }
      }
      clickedElement = overlapElement;
      const xpath = createXPathFromElement(clickedElement);
      console.log("xpath:" + xpath);
    });
  }
});

let beforeStyle = undefined;
const exchangeOverlapElement = (prevElement, nextElement) => {
  if (nextElement) {
    if (prevElement) {
      prevElement.style = beforeStyle;
    }
    beforeStyle = nextElement.style;
  }
};

const setButtonDesign = (button) => {
  button.style.width = "30px";
  button.style.height = "30px";
  button.style.borderRadius = "5px";
  button.style.background = "#fff";
  button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.4)";
  button.style.margin = "5px";
};

const setIdDisplayDesign = (idDisplay) => {
  idDisplay.style.width = "300px";
  idDisplay.style.height = "100%";
  idDisplay.style.position = "fixed";
  idDisplay.style.bottom = 0;
  idDisplay.style.right = 0;
  idDisplay.style.boxShadow = "0 2px 4px rgba(0,0,0,0.4)";
  idDisplay.style.background = "#fff";
  idDisplay.style.zIndex = 100000;
};

const loadFormat = () => {
  chrome.storage.local.get([currentUrl]).then((result) => {
    console.log(result.key);
    if (!result[currentUrl]) {
      console.log("load:no format", currentUrl);
      return;
    }
    format = JSON.parse(result[currentUrl]);
    console.log("load", currentUrl, format);
  });
};

const saveFormat = () => {
  chrome.storage.local.set({ currentUrl: format }).then(() => {
    console.log("save", currentUrl, format);
  });
  // chrome.storage.local.set({ currentUrl: JSON.stringify(format) });
};

// Copy from https://stackoverflow.com/questions/2661818/javascript-get-xpath-of-a-node
function createXPathFromElement(elm) {
  var allNodes = document.getElementsByTagName("*");
  for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {
    if (elm.hasAttribute("id")) {
      var uniqueIdCount = 0;
      for (var n = 0; n < allNodes.length; n++) {
        if (allNodes[n].hasAttribute("id") && allNodes[n].id == elm.id)
          uniqueIdCount++;
        if (uniqueIdCount > 1) break;
      }
      if (uniqueIdCount == 1) {
        segs.unshift('id("' + elm.getAttribute("id") + '")');
        return segs.join("/");
      } else {
        segs.unshift(
          elm.localName.toLowerCase() + '[@id="' + elm.getAttribute("id") + '"]'
        );
      }
    } else if (elm.hasAttribute("class")) {
      segs.unshift(
        elm.localName.toLowerCase() +
          '[@class="' +
          elm.getAttribute("class") +
          '"]'
      );
    } else {
      for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.localName == elm.localName) i++;
      }
      segs.unshift(elm.localName.toLowerCase() + "[" + i + "]");
    }
  }
  return segs.length ? "/" + segs.join("/") : null;
}

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
