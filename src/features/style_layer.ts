import { IPropsContext } from '../contexts/PropsContext';
import { StyleLayer, StyleLayerValue } from '../types/StyleLayer';
import * as resta_console from './resta_console';
export const getStyleLayer = (
  cssSelector: string,
  prop: IPropsContext,
): StyleLayer => {
  if (!cssSelector) {
    return { key: '', children: [] };
  }
  const styleLayerValue: StyleLayerValue[] = [];
  for (const format of prop.formatsArray.reverse()) {
    const formatChange = format.formats.find((format) => {
      return format.cssSelector === cssSelector;
    });
    resta_console.log('formatChange:', formatChange);
    if (!formatChange) continue;
    for (const change of formatChange.changes.reverse()) {
      for (const cssValue of change.cssValues.reverse()) {
        styleLayerValue.push({
          cssKey: change.cssKey,
          id: cssValue.id,
          url: format.url,
          value: cssValue.cssValue,
        });
      }
    }
  }
  return { key: cssSelector, children: styleLayerValue };
};
