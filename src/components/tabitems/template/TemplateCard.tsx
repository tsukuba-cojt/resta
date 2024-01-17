import { Template } from '../../../types/Template';
import React, { useContext, useEffect, useRef } from 'react';
import {
  getAbsoluteCSSSelector,
  getCssSelector,
} from '../../../utils/CSSUtils';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import { setFormatsAndPushToAry } from '../../../features/formatter';
import { getStyleSheet } from '../../../features/style_sheet';
import { createId } from '../../../utils/IDUtils';
import { PropsContext } from '../../../contexts/PropsContext';

interface TemplateCardProps {
  template: Template;
  userTemplate?: boolean;
}

const TemplateCard = (
  { template }: TemplateCardProps,
  userTemplate: boolean,
) => {
  const ref = useRef<any>(null);
  const elementSelection = useContext(ElementSelectionContext);
  const props = useContext(PropsContext);

  const onUseClick = () => {
    if (elementSelection.selectedElement) {
      setFormatsAndPushToAry(
        template.styles.map((style) => ({
          id: createId(template.name),
          cssSelector:
            getCssSelector(
              elementSelection.selectElementBy,
              elementSelection.selectedElement || null,
            ) + (style.pseudoClass ? `:${style.pseudoClass}` : ''),
          values: Object.entries(style.css).map(([key, value]) => ({
            key,
            value,
          })),
        })),
        props,
      );
    }
  };

  const insertCSS = () => {
    template.styles.forEach((style) => {
      getStyleSheet()?.insertRule(
        `${getAbsoluteCSSSelector(ref.current!)}[id='${template.name}']${
          style.pseudoClass ? `:${style.pseudoClass}` : ''
        } {\n` +
          `${Object.entries(style.css)
            .map(([key, value]) => `${key}: ${value}`)
            .join(';\n')};\n` +
          'width: 100%;' +
          '}',
      );
    });
  };

  useEffect(() => insertCSS(), []);

  let card;

  if (userTemplate && template.name) {
    card = (
      <button ref={ref} id={template.name} onClick={onUseClick}>
        {template.name}
      </button>
    );
  } else if (template.tags[0] === 'a') {
    card = (
      <a ref={ref} id={template.name} href={'#'} onClick={onUseClick}>
        ボタン
      </a>
    );
  } else if (template.tags[0] === 'button') {
    card = (
      <button ref={ref} id={template.name} onClick={onUseClick}>
        ボタン
      </button>
    );
  } else {
    card = (
      <button ref={ref} id={template.name} onClick={onUseClick}>
        ボタン
      </button>
    );
  }

  return <>{card}</>;
};

export default TemplateCard;
