import { getFormatByURL } from './output_style';
import { ImportedFormatAbstract, importFormat } from './importStyle';
import React from 'react';
import ReactDOM from 'react-dom';
import StyledComponentRegistry from '../components/utils/StyledComponentRegistry';
import StyleSelectionDialogRoot from '../components/utils/StyleSelectionDialogRoot';
import StyleDownloader from '../components/utils/StyleDownloader';
import { DEBUG_MODE } from '../consts/debug';
import { error } from './resta_console';

const HOST = 'resta-frontend.pages.dev';
export const DOWNLOAD_PAGE_URL = `https://${HOST}/style`;

// アップロードページ
export const ID_ADD_STYLE_BUTTON = 'resta-add-style';

// ダウンロードページ
export const ID_DOWNLOAD_STYLE_BUTTON = 'resta-add-style';
export const ID_FORMAT_TITLE_INPUT = 'resta-style-title';
export const ID_FORMAT_JSON_INPUT = 'resta-style-json';
export const ID_FORMAT_ID_INPUT = 'resta-style-id';
export const ID_FORMAT_AUTHOR_INPUT = 'resta-style-author';

const enableButton = (id: string, onClick: VoidFunction) => {
  const mutationObserver = new MutationObserver(() => {
    const addButton = document.getElementById(id);
    if (addButton) {
      addButton.style.display = 'block';
      addButton.addEventListener('click', onClick);
      mutationObserver.disconnect();
    }
  });

  mutationObserver.observe(document.getElementById('__next')!, {
    childList: true,
    subtree: true,
  });
};

const getValue = (id: string) => {
  return (document.getElementById(id) as HTMLInputElement).value;
};

export const downloadFormat = async (): Promise<ImportedFormatAbstract | undefined> => {
  const title = document.getElementById(ID_FORMAT_TITLE_INPUT)?.innerText;
  const json = getValue(ID_FORMAT_JSON_INPUT);
  const id = getValue(ID_FORMAT_ID_INPUT);
  const downloadUrl = `${DOWNLOAD_PAGE_URL}/${id}`;
  // const author = getValue(ID_FORMAT_AUTHOR_INPUT);

  if (!title || !json || !id || !downloadUrl) {
    error("error: ", title, json, id);
    return undefined;
  }

  await importFormat(downloadUrl, title, json, id);

  return {
    title,
    id,
    downloadUrl,
  };
};

export const enableRestaAddStyleButton = (onClick: VoidFunction) => {
  enableButton(ID_ADD_STYLE_BUTTON, onClick);
};

export const enableRestaDownloadStyleButton = (onClick: () => void) => {
  enableButton(ID_DOWNLOAD_STYLE_BUTTON, onClick);
};

export const injectStyleJson = async (url: string) => {
  (document.getElementById('resta-style-json') as HTMLInputElement).value =
    JSON.stringify(await getFormatByURL(url));
};

export const activateRestaSubsystems = () => {
  const targetHosts = DEBUG_MODE ? [HOST, 'localhost'] : [HOST];
  const url = new URL(window.location.href);

  if (targetHosts.includes(url.hostname)) {
    const insertComponent = (component: React.ReactNode) => {
      const div = document.createElement('div');
      div.setAttribute('id', 'resta-subsystem-root');
      document.body.insertAdjacentElement('beforeend', div);

      ReactDOM.render(
        <StyledComponentRegistry>{component}</StyledComponentRegistry>,
        div,
      );
    };

    // Restaのアップロードページなら
    if (url.pathname.match(/^\/upload\/$/)) {
      insertComponent(<StyleSelectionDialogRoot />);

      // Restaのダウンロードページなら
    } else if (url.pathname.match(/^\/style\/.+\/$/)) {
      insertComponent(<StyleDownloader />);
    }
  }
};
