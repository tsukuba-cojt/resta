let overlapMarker = undefined;
let overlapElement = undefined;
let clickedElement = undefined;
let currentUrl = undefined;
let edittdUrl = undefined;
const clickedColor = "rgba(255,0,0,0.4)";
const mouseoverColor = "rgba(0,0,255,0.4)";
let formatsAry = [];
let idDisplay = undefined;

export const OnLoad = () => {
  currentUrl = edittdUrl = window.location.href;
  initStyle();

  idDisplay = document.createElement("div");
  idDisplay.id = "ReDesignIdDisplay";
  setIdDisplayDesign(idDisplay);

  const boldButton = document.createElement("button");
  setButtonDesign(boldButton);
  boldButton.textContent = "B";
  boldButton.style.fontWeight = "bold";
  boldButton.onclick = async () => {
    if (clickedElement) {
      const xpath = createXPathFromElement(clickedElement);
      if (clickedElement.style.fontWeight === "bold") {
        setFormatAndPushToAry(xpath, "fontWeight", "normal");
      } else {
        setFormatAndPushToAry(xpath, "fontWeight", "bold");
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
      const xpath = createXPathFromElement(clickedElement);
      if (clickedElement.style.fontStyle === "italic") {
        setFormatAndPushToAry(xpath, "fontStyle", "normal");
      } else {
        setFormatAndPushToAry(xpath, "fontStyle", "italic");
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
  saveButton.textContent = "💾";
  saveButton.onclick = async () => {
    const xpath = createXPathFromElement(clickedElement);
    console.log("xpath:" + xpath);
    saveFormat();
  };
  idDisplay.appendChild(saveButton);

  document.body.appendChild(idDisplay);
};

const initStyle = async () => {
  // localからjson形式のデータを取得しparseしたものをformatsAryへ代入
  await loadFormat();
  // このページに対応するフォーマットがあれば適用
  applyFormats();
};

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

// スタイルに変更を加えてformatsListに変更内容を追加
const setFormatAndPushToAry = (xpath, key, value) => {
  const elem = getElementByXpath(xpath);
  if (!elem || !key || !value) {
    console.log("setFormatAndPushToAry:invalid args:", xpath, key, value);
    return;
  }
  // スタイルの変更
  elem.style[key] = value;
  // 配列への追加処理
  // 以下のif文は、各配列が存在しない場合に配列を作成する処理
  // すでに該当箇所への変更がある場合は書き換えている
  if (!formatsAry || !formatsAry.find((e) => e.url === edittdUrl)) {
    formatsAry.push({ url: edittdUrl, formats: [] });
  }
  if (
    !formatsAry
      .find((e) => e.url === edittdUrl)
      .formats.find((e) => e.xpath === xpath)
  ) {
    formatsAry
      .find((e) => e.url === edittdUrl)
      .formats.push({ xpath: xpath, styles: [] });
  }
  if (
    formatsAry
      .find((e) => e.url === edittdUrl)
      .formats.find((e) => e.xpath === xpath)
      .styles.find((e) => e.key === key)
  ) {
    formatsAry
      .find((e) => e.url === edittdUrl)
      .formats.find((e) => e.xpath === xpath)
      .styles.find((e) => e.key === key).value = value;
  } else {
    formatsAry
      .find((e) => e.url === edittdUrl)
      .formats.find((e) => e.xpath === xpath)
      .styles.push({ key: key, value: value });
  }
  console.log(formatsAry);
};

// TODO: mouseoverが取れたらもともとのStyleに戻す (今はすべて空文字列に変えている) @K-Kazuyuki
let beforeStyle = undefined;
const exchangeOverlapElementStyle = (prevElement, nextElement) => {
  if (nextElement) {
    if (prevElement) {
      prevElement.style = beforeStyle;
    }
    beforeStyle = nextElement.style;
  }
};

const loadFormat = async () => {
  await chrome.storage.local.get(["formats"]).then((result) => {
    if (!result.formats) {
      console.log("load:no format", currentUrl);
      return;
    } else {
      console.log("load", currentUrl, JSON.parse(result.formats));
      if (JSON.parse(result.formats)) formatsAry = JSON.parse(result.formats);
      return;
    }
  });
};

const saveFormat = () => {
  if (formatsAry.length == 0) return;
  chrome.storage.local.set({ formats: JSON.stringify(formatsAry) }).then(() => {
    console.log("save", currentUrl, formatsAry);
  });
};

const applyFormats = () => {
  const formats = formatsAry.filter((e) => currentUrl.match(e.url));
  for (const f of formats) {
    console.log(f);
    for (const format of f.formats) {
      const xpath = format.xpath;
      const styles = format.styles;
      const elem = getElementByXpath(xpath);
      if (!elem) continue;
      for (const style of styles) {
        console.log(style);
        elem.style[style.key] = style.value;
      }
    }
  }
};

// Copy from https://stackoverflow.com/questions/2661818/javascript-get-xpath-of-a-node
const createXPathFromElement = (elm) => {
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
      for (
        var i = 1, sib = elm.previousSibling;
        sib;
        sib = sib.previousSibling
      ) {
        if (sib.localName == elm.localName) i++;
      }
      segs.unshift(elm.localName.toLowerCase() + "[" + i + "]");
    }
  }
  return segs.length ? "/" + segs.join("/") : null;
};

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

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
