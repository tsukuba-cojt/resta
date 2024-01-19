import { notification } from 'antd';
import React, { useEffect } from 'react';
import {
  DOWNLOAD_PAGE_URL,
  enableRestaDownloadStyleButton,
  ID_FORMAT_AUTHOR_INPUT,
  ID_FORMAT_ID_INPUT,
  ID_FORMAT_IMAGE,
  ID_FORMAT_JSON_INPUT,
  ID_FORMAT_TITLE
} from '../../features/upload_import_manager';
import t from '../../features/translator';
import usePropsContext, { PropsContext } from '../../contexts/PropsContext';
import { ImportedFormatAbstract, importFormat } from '../../features/importStyle';
import { error } from '../../features/resta_console';

const StyleDownloader = () => {
  const [api, contextHolder] = notification.useNotification();
  const prop = usePropsContext();

  const downloadFormat = async (): Promise<
    ImportedFormatAbstract | undefined
  > => {
    const getValue = (id: string) => {
      return (document.getElementById(id) as HTMLInputElement).value;
    };

    const title = document.getElementById(ID_FORMAT_TITLE)?.innerText;
    const json = getValue(ID_FORMAT_JSON_INPUT);
    const id = getValue(ID_FORMAT_ID_INPUT);
    const imageUrl =
      document.getElementById(ID_FORMAT_IMAGE)?.getAttribute('src') ?? undefined;
    const downloadUrl = `${DOWNLOAD_PAGE_URL}/${id}`;
    const author = document.getElementById(ID_FORMAT_AUTHOR_INPUT)?.innerText;

    if (!title || !json || !id || !downloadUrl) {
      error('error: ', title, json, id);
      return undefined;
    }

    await importFormat(downloadUrl, title, json, id, imageUrl, author, prop);

    return {
      title,
      id,
      downloadUrl,
      imageUrl,
      author,
    };
  };

  useEffect(() => {
    enableRestaDownloadStyleButton(() => {
      (async () => {
        const result = await downloadFormat();
        if (result) {
          api.info({
            message: result.title,
            description: t('import_success'),
            placement: 'bottomRight',
          });

        } else {
          api.error({
            message: t("error"),
            description: t('import_error'),
            placement: 'bottomRight',
          });
        }
      })();
    });
  }, []);

  return (
    <PropsContext.Provider value={prop}>
      {contextHolder}
    </PropsContext.Provider>
  );
};

export default StyleDownloader;
