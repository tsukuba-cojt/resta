(async () => {
  const src = chrome.runtime.getURL("scripts/content.js");
  const contentScript = await import(src);
  contentScript.onLoad();
})();
