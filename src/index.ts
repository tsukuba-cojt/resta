import * as prop from './features/prop';
import { initStyle } from './features/formatter';
import loadRestaSetting from './features/setting_loader';
import { initContainer } from './features/root_manager';
import * as resta_console from './features/resta_console';
import { activateRestaSubsystems } from './features/upload_import_manager';
import { testCssParse } from './features/createStyle';

export let isContainerActive: boolean = false;
export const setContainerActive = (value: boolean) => {
  isContainerActive = value;
};

window.addEventListener('load', () => {
  resta_console.log('OnUpdated');
  testCssParse();

  prop.setUrl(window.location.href);

  (async () => {
    resta_console.log('Init Style');
    await initStyle();
  })();
});

const activateContainer = () => {
  if (isContainerActive) return;
  resta_console.log('Load Resta Setting');
  loadRestaSetting().then((categoryMap) => {
    initContainer(categoryMap);
  });
};

chrome.runtime.onMessage.addListener((req) => {
  console.log('req', req);
  if (req.type === 'url') {
    activateContainer();
    isContainerActive = true;
  } else if (req.type === 'activate') {
    resta_console.log('Activate');
  }
});

const target = document.querySelector('body');
const observer = new MutationObserver(() => {
  resta_console.log('OnUpdated');

  initStyle();
});
observer.observe(target!, {
  childList: true,
});

(window as any).activateRestaSubsystems = activateRestaSubsystems;
