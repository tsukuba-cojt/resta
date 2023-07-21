import { loadFormatForOutput } from './format_manager';
import * as prop from './prop';
import { compressStyle } from './style_compresser';

export const getChangedUrls = (): string[] => {
  loadFormatForOutput();
  const urls: string[] = prop.formatsArray.map((e) => e.url);
  return urls;
};

export const getFormatByURL = (url: string) => {
  loadFormatForOutput(url);
  return compressStyle();
};
