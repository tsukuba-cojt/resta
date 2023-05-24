import {onLoad} from 'content.js';

/*
(async () => {
  const src: string = chrome.runtime.getURL('scripts/content.js');
  const contentScript = await import(src);
  contentScript.onLoad();
})();
*/

window.onload = onLoad;