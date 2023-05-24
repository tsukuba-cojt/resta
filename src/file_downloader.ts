export const downloadSetting = () => {
  const axios = require('axios');

  const endpoint =
    'https://api.github.com/repos/K-Kazuyuki/resta-ui-setting/contents/resta-setting.json';

  axios
    .get(endpoint)
    .then((response: any) => {
      const content = response.data.content;
      console.log('downloaded', Buffer.from(response.data.content, 'base64').toString());
      const json = JSON.parse(content);
      // Do something with the JSON data.
    });
};
