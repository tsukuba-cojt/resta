import { useCallback, useContext } from 'react';
import { IPropsContext } from '../contexts/PropsContext';
import { Format } from '../types/Format';
import * as resta_console from '../features/resta_console';
import { removeStyleRule, setStyleRule } from '../features/style_sheet';

type ReturnType = {
  removeAllFormats: VoidFunction;
  removeCurrentFormat: VoidFunction;
  sortFormats: VoidFunction;
  getDisplayFormat: (
    formatsArray: (Format | undefined)[],
    cssKey: string,
  ) => string | undefined;
  updateFormat: (cssSelector: string, cssKey: string) => void;
  matchUrl: (currentUrl: string, matchUrl: string) => boolean;
};

export default function useFormatUtils(): ReturnType {
  const props = useContext(PropsContext);

  const removeAllFormats = useCallback(() => {
    const newFormatsArray = props.formatsArray.splice(
      0,
      props.formatsArray.length,
    );
    props.setFormatsArray(newFormatsArray);
    resta_console.log('resetFormatsAry', newFormatsArray);
  }, [props.formatsArray]);

  const removeCurrentFormat = useCallback(() => {
    const index = props.formatsArray.findIndex(
      (x) => x.url === props.currentUrl,
    );
    if (index !== -1) {
      const newFormatsArray = props.formatsArray.splice(index, 1);
      props.setFormatsArray(newFormatsArray);
    }
  }, [props.formatsArray, props.currentUrl]);

  const sortFormats = useCallback(() => {
    props.setFormatsArray(
      props.formatsArray
        .filter((e) => e.formats.length !== 0)
        .sort(
          (e) =>
            (e.url.match(/\//g) || []).length &&
            (e.url[e.url.length - 1] === '*' ? -1 : 1),
        ),
    );
  }, [props.formatsArray]);

  const getDisplayFormat = useCallback(
    (formatsArray: (Format | undefined)[], cssKey: string) => {
      if (!formatsArray || formatsArray.length === 0) {
        return undefined;
      }
      const format: (Format | undefined)[] = formatsArray.filter(
        (e) => e?.changes.find((l) => l.cssKey === cssKey),
      );
      const value = format[format.length - 1]?.changes.find(
        (e) => e.cssKey === cssKey,
      );
      if (!value || value.cssValues.length === 0) {
        return undefined;
      }
      resta_console.log(
        'getDisplayFormat',
        value.cssValues[value.cssValues.length - 1].cssValue,
      );
      return value.cssValues[value.cssValues.length - 1].cssValue;
    },
    [props.formatsArray],
  );

  const updateFormat = useCallback(
    (cssSelector: string, cssKey: string) => {
      const value = getDisplayFormat(
        props.formatsArray
          .map((e) => e.formats)
          .filter((e) => e !== undefined)
          .map((e) => e.find((e) => e.cssSelector === cssSelector))
          .filter((e) => e !== undefined),
        cssKey,
      );
      if (!value) {
        removeStyleRule(cssSelector, cssKey);
        return;
      }
      setStyleRule({
        cssSelector: cssSelector,
        keys: [cssKey],
      });
    },
    [props.formatsArray],
  );

  const matchUrl = useCallback(
    (currentUrl: string, matchUrl: string) => {
      if (!matchUrl || !currentUrl) {
        return false;
      }
      let hasWildcard = false;
      let compareUrl = '';
      // 最後の文字が*ならワイルドカードとして扱う
      if (matchUrl[matchUrl.length - 1] === '*') {
        hasWildcard = true;
        compareUrl = matchUrl.slice(0, -1);
      }
      if (hasWildcard) {
        return currentUrl === compareUrl || currentUrl.startsWith(compareUrl);
      } else {
        return currentUrl === matchUrl;
      }
    },
    [props.formatsArray],
  );

  return {
    removeAllFormats,
    removeCurrentFormat,
    sortFormats,
    getDisplayFormat,
    updateFormat,
    matchUrl,
  };
}
