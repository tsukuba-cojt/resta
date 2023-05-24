import { Buffer } from 'buffer';

export const downloadUiSetting = async () => {
  const axios = require('axios');

  let json: any;

  const endpoint =
    'https://api.github.com/repos/K-Kazuyuki/resta-ui-setting/contents/resta-setting.json';

  await axios.get(endpoint).then((response: any) => {
    const content = Buffer.from(response.data.content, 'base64').toString();
    json = JSON.parse(content);

    console.log('Download Success', json);
  });
  return json && json.styles ? json.styles : null;
};
