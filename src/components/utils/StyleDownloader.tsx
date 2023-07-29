import { notification } from 'antd';
import { useEffect } from 'react';
import {
  downloadFormat,
  enableRestaDownloadStyleButton,
} from '../../features/upload_import_manager';
import t from '../../features/translator';

const StyleDownloader = () => {
  const [api, contextHolder] = notification.useNotification();

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

  return contextHolder;
};

export default StyleDownloader;
