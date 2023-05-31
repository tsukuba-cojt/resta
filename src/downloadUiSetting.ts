import { Language } from './types/Language';
import { RestaStyle, RestaStyles } from './types/RestaSetting';

export const downloadUiSetting = async (): Promise<RestaStyle[]> => {
  const endpoint =
    'https://raw.githubusercontent.com/K-Kazuyuki/resta-ui-setting/main/resta-setting.json';
  const json = await (await fetch(endpoint)).json();
  return (json as RestaStyles).styles;
};

export const downloadLangJson = async () => {
  const endpoint =
    'https://raw.githubusercontent.com/K-Kazuyuki/resta-ui-setting/main/lang.json';
  const json = await (await fetch(endpoint)).json();
  return json as Language;
};
