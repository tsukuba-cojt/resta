import styled from 'styled-components';
import ResizableComponent from './ResizableComponent';
import React, { useMemo } from 'react';
import BorderRadiusStyler from './BorderRadiusStyler';
import useInteractiveStylingHelper from '../../../../hooks/useInteractiveStylingHelper';
import { Tabs, TabsProps } from 'antd';
import StylerTabContent from './StylerTabContent';
import BorderStylerTabContent from './BorderStylerTabContent';

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

export default function InteractiveStyler() {
  const MAX_VALUE = 25;
  const h = useInteractiveStylingHelper();
  const baseOffsetX = useMemo(() => (BASE_SIZE - ELEMENT_SIZE) / 2, []);
  const baseOffsetY = useMemo(() => (BASE_SIZE - ELEMENT_SIZE) / 2, []);

  const paddingTop = useMemo(() => Math.min(MAX_VALUE, h.paddingTop), [h.paddingTop]);
  const paddingRight = useMemo(() => Math.min(MAX_VALUE, h.paddingRight), [h.paddingRight]);
  const paddingBottom = useMemo(() => Math.min(MAX_VALUE, h.paddingBottom), [h.paddingBottom]);
  const paddingLeft = useMemo(() => Math.min(MAX_VALUE, h.paddingLeft), [h.paddingLeft]);
  const marginTop = useMemo(() => Math.min(MAX_VALUE, h.marginTop), [h.marginTop]);
  const marginRight = useMemo(() => Math.min(MAX_VALUE, h.marginRight), [h.marginRight]);
  const marginBottom = useMemo(() => Math.min(MAX_VALUE, h.marginBottom), [h.marginBottom]);
  const marginLeft = useMemo(() => Math.min(MAX_VALUE, h.marginLeft), [h.marginLeft]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'パディング',
      children: <StylerTabContent topValue={h.paddingTop} rightValue={h.paddingRight} bottomValue={h.paddingBottom}
                                  leftValue={h.paddingLeft}
                                  setTopValue={h.setPaddingTop} setRightValue={h.setPaddingRight}
                                  setBottomValue={h.setPaddingBottom} setLeftValue={h.setPaddingLeft} />
    },
    {
      key: '2',
      label: 'マージン',
      children: <StylerTabContent topValue={h.marginTop} rightValue={h.marginRight} bottomValue={h.marginBottom}
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

  return (
    <>
      <Wrapper>
        <ResizableComponent baseWidth={ELEMENT_SIZE + paddingLeft + paddingRight}
                            baseHeight={ELEMENT_SIZE + paddingTop + paddingBottom}
                            offsetX={baseOffsetX - marginLeft - paddingLeft}
                            offsetY={baseOffsetY - marginTop - paddingTop}
                            isSelected={h.isMarginSelected}
                            top={marginTop} right={marginRight} bottom={marginBottom} left={marginLeft}
                            color={'#F8CB9C'}
                            onMouseDown={h.onMouseDownOnMarginStyler}
                            onMouseClick={h.onMouseClickOnMarginStyler} />
        <ResizableComponent baseWidth={ELEMENT_SIZE} baseHeight={ELEMENT_SIZE}
                            offsetX={baseOffsetX - paddingLeft}
                            offsetY={baseOffsetY - paddingTop} isSelected={h.isPaddingSelected}
                            top={paddingTop} right={paddingRight} bottom={paddingBottom} left={paddingLeft}
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