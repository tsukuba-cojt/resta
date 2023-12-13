import { IPropsContext } from '../contexts/PropsContext';
import { matchUrl } from '../utils/urlUtil';

export const getIndex = (
  cssSelector: string,
  key: string,
  id: number | string,
  prop: IPropsContext,
): number | undefined => {
  return prop.formatsArray
    .find((e) => matchUrl(prop.editedUrl, e.url))
    ?.formats.find((e) => e.cssSelector === cssSelector)
    ?.changes.find((e) => e.cssKey === key)
    ?.cssValues.findIndex((e) => e.id === id);
};
export const getFormatValue = (
  cssSelector: string,
  key: string,
  id: number | string,
  prop: IPropsContext,
): string | undefined => {
  return prop.formatsArray
    .find((e) => matchUrl(prop.editedUrl, e.url))
    ?.formats.find((e) => e.cssSelector === cssSelector)
    ?.changes.find((e) => e.cssKey === key)
    ?.cssValues.find((e) => e.id === id)?.cssValue;
};
