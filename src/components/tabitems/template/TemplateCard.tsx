import { Template } from '../../../types/Template';
import React, { useContext, useEffect, useRef } from 'react';
import { getAbsoluteCSSSelector } from '../../../utils/CSSUtils';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import { setFormatsAndPushToAry } from '../../../features/formatter';
import { getStyleSheet } from '../../../features/style_sheet';
import { UIUpdaterContext } from '../../../contexts/UIUpdater';
import { createId } from '../../../utils/IDUtils';

interface TemplateCardProps {
  template: Template;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const ref = useRef<any>(null);
  const elementSelection = useContext(ElementSelectionContext);
  const updater = useContext(UIUpdaterContext);

  const onUseClick = () => {
    if (elementSelection.selectedElement) {
      setFormatsAndPushToAry(
        template.styles.map((style) => ({
          id: createId(template.name),
          cssSelector:
            getAbsoluteCSSSelector(elementSelection.selectedElement!) +
            (style.pseudoClass ? `:${style.pseudoClass}` : ''),
          values: Object.entries(style.css).map(([key, value]) => ({
            key,
            value,
          })),
        })),
      );

      updater.formatChanged();
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

  return (
    <>
      {template.tags[0] === 'a' && (
        <a ref={ref} id={template.name} href={'#'} onClick={onUseClick}>
          ボタン
        </a>
      )}
      {template.tags[0] === 'button' && (
        <button ref={ref} id={template.name} onClick={onUseClick}>
          ボタン
        </button>
      )}
    </>
  );
};

export default TemplateCard;
