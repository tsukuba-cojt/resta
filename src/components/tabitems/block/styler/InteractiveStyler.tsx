import styled from 'styled-components';
import ResizableComponent from './ResizableComponent';
import React, { useContext, useEffect, useMemo } from 'react';
import BorderRadiusStyler from './BorderRadiusStyler';
import useInteractiveStylingHelper from '../../../../hooks/useInteractiveStylingHelper';
import { Tabs, TabsProps } from 'antd';
import StylerTabContent from './StylerTabContent';
import BorderStylerTabContent from './BorderStylerTabContent';
import { ElementSelectionContext } from '../../../../contexts/ElementSelectionContext';
import { getDecimalFromCSSValue } from '../../../../utils/CSSUtils';

const BASE_SIZE = 200;
const ELEMENT_SIZE = 50;

const Wrapper = styled.div`
  position: relative;
  width: ${BASE_SIZE}px;
  height: ${BASE_SIZE}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * ブロック要素のスタイルをインタラクティブに設定するコンポーネント
 * @constructor
 */
export default function InteractiveStyler() {
  const MAX_VALUE = 25;
  const h = useInteractiveStylingHelper();
  const baseOffsetX = useMemo(() => (BASE_SIZE - ELEMENT_SIZE) / 2, []);
  const baseOffsetY = useMemo(() => (BASE_SIZE - ELEMENT_SIZE) / 2, []);

  const paddingTop = useMemo(() => h.paddingTop != undefined ? Math.min(MAX_VALUE, h.paddingTop) : undefined, [h.paddingTop]);
  const paddingRight = useMemo(() => h.paddingRight != undefined ? Math.min(MAX_VALUE, h.paddingRight) : undefined, [h.paddingRight]);
  const paddingBottom = useMemo(() => h.paddingBottom != undefined ? Math.min(MAX_VALUE, h.paddingBottom) : undefined, [h.paddingBottom]);
  const paddingLeft = useMemo(() => h.paddingLeft != undefined ? Math.min(MAX_VALUE, h.paddingLeft) : undefined, [h.paddingLeft]);
  const marginTop = useMemo(() => h.marginTop != undefined ? Math.min(MAX_VALUE, h.marginTop) : undefined, [h.marginTop]);
  const marginRight = useMemo(() => h.marginRight != undefined ? Math.min(MAX_VALUE, h.marginRight) : 0, [h.marginRight]);
  const marginBottom = useMemo(() => h.marginBottom != undefined ? Math.min(MAX_VALUE, h.marginBottom) : 0, [h.marginBottom]);
  const marginLeft = useMemo(() => h.marginLeft != undefined ? Math.min(MAX_VALUE, h.marginLeft) : undefined, [h.marginLeft]);

  /**
   * タブの要素
   */
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'パディング',
      children: <StylerTabContent type={'padding'} topValue={h.paddingTop} rightValue={h.paddingRight}
                                  bottomValue={h.paddingBottom}
                                  leftValue={h.paddingLeft}
                                  setTopValue={h.setPaddingTop} setRightValue={h.setPaddingRight}
                                  setBottomValue={h.setPaddingBottom} setLeftValue={h.setPaddingLeft} />
    },
    {
      key: '2',
      label: 'マージン',
      children: <StylerTabContent type={'margin'} topValue={h.marginTop} rightValue={h.marginRight}
                                  bottomValue={h.marginBottom}
                                  leftValue={h.marginLeft}
                                  setTopValue={h.setMarginTop} setRightValue={h.setMarginRight}
                                  setBottomValue={h.setMarginBottom} setLeftValue={h.setMarginLeft} />
    },
    {
      key: '3',
      label: '枠線と角丸',
      children: <BorderStylerTabContent topValue={h.borderTopLeft} rightValue={h.borderTopRight}
                                        bottomValue={h.borderBottomRight}
                                        leftValue={h.borderBottomLeft}
                                        setTopValue={h.setBorderTopLeft} setRightValue={h.setBorderTopRight}
                                        setBottomValue={h.setBorderBottomRight} setLeftValue={h.setBorderBottomLeft} />
    }
  ];

  const elementSelection = useContext(ElementSelectionContext);
  useEffect(() => {
    if (!elementSelection.selectedElement) {
      return;
    }

    const style = getComputedStyle(elementSelection.selectedElement);
    h.setPaddingTop(getDecimalFromCSSValue(style.paddingTop));
    h.setPaddingRight(getDecimalFromCSSValue(style.paddingRight));
    h.setPaddingBottom(getDecimalFromCSSValue(style.paddingBottom));
    h.setPaddingLeft(getDecimalFromCSSValue(style.paddingLeft));
    h.setMarginTop(getDecimalFromCSSValue(style.marginTop));
    h.setMarginRight(getDecimalFromCSSValue(style.marginRight));
    h.setMarginBottom(getDecimalFromCSSValue(style.marginBottom));
    h.setMarginLeft(getDecimalFromCSSValue(style.marginLeft));
    h.setBorderTopLeft({
      style: style.borderStyle as BorderStyle,
      width: getDecimalFromCSSValue(style.borderTopWidth),
      color: style.borderTopColor,
      radius: getDecimalFromCSSValue(style.borderTopLeftRadius)
    });
    h.setBorderTopRight({
      style: style.borderStyle as BorderStyle,
      width: getDecimalFromCSSValue(style.borderTopWidth),
      color: style.borderTopColor,
      radius: getDecimalFromCSSValue(style.borderTopRightRadius)
    });
    h.setBorderBottomRight({
      style: style.borderStyle as BorderStyle,
      width: getDecimalFromCSSValue(style.borderBottomWidth),
      color: style.borderBottomColor,
      radius: getDecimalFromCSSValue(style.borderBottomRightRadius)
    });
    h.setBorderBottomLeft({
      style: style.borderStyle as BorderStyle,
      width: getDecimalFromCSSValue(style.borderBottomWidth),
      color: style.borderBottomColor,
      radius: getDecimalFromCSSValue(style.borderBottomLeftRadius)
    });

  }, [elementSelection.selectedElement]);

  return (
    <>
      <Wrapper>
        <ResizableComponent baseWidth={ELEMENT_SIZE + (paddingLeft ?? 0) + (paddingRight ?? 0)}
                            baseHeight={ELEMENT_SIZE + (paddingTop ?? 0) + (paddingBottom ?? 0)}
                            offsetX={baseOffsetX - (marginLeft ?? 0) - (paddingLeft ?? 0)}
                            offsetY={baseOffsetY - (marginTop ?? 0) - (paddingTop ?? 0)}
                            isSelected={h.isMarginSelected}
                            top={marginTop ?? 0} right={marginRight ?? 0} bottom={marginBottom ?? 0}
                            left={marginLeft ?? 0}
                            actualTop={h.marginTop} actualRight={h.marginRight} actualBottom={h.marginBottom}
                            actualLeft={h.marginLeft}
                            color={'#F8CB9C'}
                            onMouseDown={h.onMouseDownOnMarginStyler}
                            onMouseClick={h.onMouseClickOnMarginStyler} />
        <ResizableComponent baseWidth={ELEMENT_SIZE} baseHeight={ELEMENT_SIZE}
                            offsetX={baseOffsetX - (paddingLeft ?? 0)}
                            offsetY={baseOffsetY - (paddingTop ?? 0)} isSelected={h.isPaddingSelected || h.isBorderSelected}
                            top={paddingTop ?? 0} right={paddingRight ?? 0} bottom={paddingBottom ?? 0}
                            left={paddingLeft ?? 0}
                            actualTop={h.paddingTop} actualRight={h.paddingRight} actualBottom={h.paddingBottom}
                            actualLeft={h.paddingLeft}
                            borderTopLeft={h.borderTopLeft} borderTopRight={h.borderTopRight}
                            borderBottomRight={h.borderBottomRight} borderBottomLeft={h.borderBottomLeft}
                            color={'#ffffff'}
                            onMouseDown={h.onMouseDownOnPaddingStyler}
                            onMouseClick={h.onMouseClickOnPaddingStyler}>
          {h.isBorderSelected &&
            <>
              <BorderRadiusStyler direction={'top-left'} border={h.borderTopLeft}
                                  setBorder={h.setBorderTopLeft} />
              <BorderRadiusStyler direction={'top-right'} border={h.borderTopRight}
                                  setBorder={h.setBorderTopRight} />
              <BorderRadiusStyler direction={'bottom-right'} border={h.borderBottomRight}
                                  setBorder={h.setBorderBottomRight} />
              <BorderRadiusStyler direction={'bottom-left'} border={h.borderBottomLeft}
                                  setBorder={h.setBorderBottomLeft} />
            </>
          }
        </ResizableComponent>
        <ResizableComponent baseWidth={ELEMENT_SIZE} baseHeight={ELEMENT_SIZE} selectable={false}
                            offsetX={baseOffsetX}
                            offsetY={baseOffsetY}
                            top={0} right={0} bottom={0} left={0} color={'transparent'}>
          <span>要素</span>
        </ResizableComponent>
      </Wrapper>

      <Tabs centered style={{ width: '100%' }} defaultActiveKey='1'
            activeKey={h.isPaddingSelected ? '1' : h.isMarginSelected ? '2' : '3'} items={items} onChange={(key) => {
        switch (key) {
          case '1':
            h.setIsPaddingSelected(true);
            h.setIsMarginSelected(false);
            h.setIsBorderSelected(false);
            break;
          case '2':
            h.setIsPaddingSelected(false);
            h.setIsMarginSelected(true);
            h.setIsBorderSelected(false);
            break;
          case '3':
            h.setIsPaddingSelected(false);
            h.setIsMarginSelected(false);
            h.setIsBorderSelected(true);
            break;
        }
      }} />
    </>
  );
}