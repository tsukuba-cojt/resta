import * as prop from './features/prop';
import { initStyle } from './features/formatter';
import loadRestaSetting from './features/setting_loader';
import { initContainer } from './features/root_manager';
import * as resta_console from './features/resta_console';
import ReactDOM from 'react-dom';
import React from 'react';
import StyleSelectionDialogRoot from './components/selectiondialog/StyleSelectionDialogRoot';
import StyledComponentRegistry from './features/StyledComponentRegistry';
import { loadFormat } from './features/format_manager';
import StyleDownloader from "./components/utils/StyleDownloader";

const RESTA_UPLOAD_HOSTS = ['resta-frontend.pages.dev', 'localhost'];

export let isContainerActive: boolean = false;
export const setContainerActive = (value: boolean) => {
  isContainerActive = value;
};

window.addEventListener('load', () => {
  resta_console.log('OnUpdated');

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
    loadFormat();
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

const url = new URL(window.location.href);
if (RESTA_UPLOAD_HOSTS.includes(url.hostname)) {
  const insertComponent = (component: React.ReactNode) => {
    const div = document.createElement('div');
    div.setAttribute('id', 'resta-subsystem-root');
    document.body.insertAdjacentElement('beforeend', div);

    ReactDOM.render(
        <StyledComponentRegistry>
          {component}
        </StyledComponentRegistry>,
        div
    );
  }

  // Restaのアップロードページなら
  if (url.pathname.match(/^\/upload\/$/)) {
    insertComponent(<StyleSelectionDialogRoot/>);

    // Restaのダウンロードページなら
  } else if (url.pathname.match(/^\/style\/.+\/$/)) {
    insertComponent(<StyleDownloader />);
  }
}