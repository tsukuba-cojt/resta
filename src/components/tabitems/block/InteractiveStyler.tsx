import styled from "styled-components";
import ResizableComponent from "./ResizableComponent";
import React, {useMemo} from "react";
import BorderRadiusStyler from "./BorderRadiusStyler";
import useInteractiveStylingHelper from '../../../hooks/useInteractiveStylingHelper';

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
  const h = useInteractiveStylingHelper();
  const baseOffsetX = useMemo(() => (BASE_SIZE - ELEMENT_SIZE) / 2, []);
  const baseOffsetY = useMemo(() => (BASE_SIZE - ELEMENT_SIZE) / 2, []);

  const paddingTop = useMemo(() => Math.min(20, h.paddingTop), [h.paddingTop]);
  const paddingRight = useMemo(() => Math.min(20, h.paddingRight), [h.paddingRight]);
  const paddingBottom = useMemo(() => Math.min(20, h.paddingBottom), [h.paddingBottom]);
  const paddingLeft = useMemo(() => Math.min(20, h.paddingLeft), [h.paddingLeft]);
  const borderTop = useMemo(() => Math.min(20, h.borderTopLeft?.width ?? 0), [h.borderTopLeft]);
  const borderRight = useMemo(() => Math.min(20, h.borderTopRight?.width ?? 0), [h.borderTopRight]);
  const borderBottom = useMemo(() => Math.min(20, h.borderBottomLeft?.width ?? 0), [h.borderBottomLeft]);
  const borderLeft = useMemo(() => Math.min(20, h.borderBottomLeft?.width ?? 0), [h.borderBottomLeft]);
  const marginTop = useMemo(() => Math.min(20, h.marginTop), [h.marginTop]);
  const marginRight = useMemo(() => Math.min(20, h.marginRight), [h.marginRight]);
  const marginBottom = useMemo(() => Math.min(20, h.marginBottom), [h.marginBottom]);
  const marginLeft = useMemo(() => Math.min(20, h.marginLeft), [h.marginLeft]);

  return (
    <Wrapper>
      <ResizableComponent baseWidth={ELEMENT_SIZE + paddingLeft + paddingRight + borderLeft + borderRight}
                          baseHeight={ELEMENT_SIZE + paddingTop + paddingBottom + borderTop + borderBottom}
                          offsetX={baseOffsetX - marginLeft - borderLeft - paddingLeft}
                          offsetY={baseOffsetY - marginTop - borderTop - paddingTop}
                          isSelected={h.isMarginSelected}
                          top={marginTop} right={marginRight} bottom={marginBottom} left={marginLeft}
                          color={"#F8CB9C"}
                          onMouseDown={h.onMouseDownOnMarginStyler}
                          onMouseClick={h.onMouseClickOnMarginStyler}/>
      <ResizableComponent baseWidth={ELEMENT_SIZE} baseHeight={ELEMENT_SIZE}
                          offsetX={baseOffsetX - paddingLeft}
                          offsetY={baseOffsetY - paddingTop} isSelected={h.isPaddingSelected}
                          top={paddingTop} right={paddingRight} bottom={paddingBottom} left={paddingLeft}
                          borderTopLeft={h.borderTopLeft} borderTopRight={h.borderTopRight}
                          borderBottomRight={h.borderBottomRight} borderBottomLeft={h.borderBottomLeft}
                          color={"#ffffff"}
                          onMouseDown={h.onMouseDownOnPaddingStyler}
                          onMouseClick={h.onMouseClickOnPaddingStyler}>
        { h.isPaddingSelected &&
          <>
              <BorderRadiusStyler direction={'top-left'} border={h.borderTopLeft} setBorder={h.setBorderTopLeft} />
              <BorderRadiusStyler direction={'top-right'} border={h.borderTopRight} setBorder={h.setBorderTopRight} />
              <BorderRadiusStyler direction={'bottom-right'} border={h.borderBottomRight} setBorder={h.setBorderBottomRight} />
              <BorderRadiusStyler direction={'bottom-left'} border={h.borderBottomLeft} setBorder={h.setBorderBottomLeft} />
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
  )
}