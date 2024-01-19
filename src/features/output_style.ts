import { compressStyle } from './style_compresser';

export const getChangedUrls = async (): Promise<string[]> => {
  const result = await chrome.storage.local.get(['formats']);
  return JSON.parse(result.formats).map((obj: { url: string }) => obj.url);
};

export const getFormatByURL = async (url: string) => {
  return await compressStyle(url);
};
