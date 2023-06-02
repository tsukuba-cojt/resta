import { RestaStyle, RestaStyles } from '../types/RestaSetting';
import { Language } from '../types/Language';

export const downloadUiSetting = async (): Promise<RestaStyle[]> => {
  const endpoint =
    'https://raw.githubusercontent.com/K-Kazuyuki/resta-ui-setting/main/resta-setting.json';
  const restaStyles = (await (await fetch(endpoint)).json()) as RestaStyles;
  return restaStyles.styles.sort((a, b) => (a.id < b.id ? -1 : 1));
};

export const downloadLangJson = async () => {
  const endpoint =
    'https://raw.githubusercontent.com/K-Kazuyuki/resta-ui-setting/main/lang.json';
  const json = await (await fetch(endpoint)).json();
  return json as Language;
};
