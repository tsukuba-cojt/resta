import styled from "styled-components";
import React, {useRef} from "react";

const Wrapper = styled.div<{
  bgColor: string,
  hoverColor: string,
  width: number,
  height: number,
  top: number,
  left: number,
  selectable: boolean,
  isSelected: boolean,
  borderTopLeft?: Border,
  borderTopRight?: Border,
  borderBottomRight?: Border,
  borderBottomLeft?: Border,
}>`
  position: absolute;
  background-color: ${props => props.bgColor};
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  cursor: ${props => props.selectable ? "pointer" : "default"};
  box-shadow: ${props => props.isSelected ? "0px 0px 8px 1px #000000" : "none"};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  border-top: ${props => props.borderTopLeft ? `${props.borderTopLeft.type} ${props.borderTopLeft.width}px ${props.borderTopLeft.color}` : 'none'};
  border-right: ${props => props.borderTopRight ? `${props.borderTopRight.type} ${props.borderTopRight.width}px ${props.borderTopRight.color}` : 'none'};
  border-bottom: ${props => props.borderBottomRight ? `${props.borderBottomRight.type} ${props.borderBottomRight.width}px ${props.borderBottomRight.color}` : 'none'};
  border-left: ${props => props.borderBottomLeft ? `${props.borderBottomLeft.type} ${props.borderBottomLeft.width}px ${props.borderBottomLeft.color}` : 'none'};
  border-top-left-radius: ${props => props.borderTopLeft ? `${props.borderTopLeft.radius}px` : '0'};
  border-top-right-radius: ${props => props.borderTopRight ? `${props.borderTopRight.radius}px` : '0'};
  border-bottom-right-radius: ${props => props.borderBottomRight ? `${props.borderBottomRight.radius}px` : '0'};
  border-bottom-left-radius: ${props => props.borderBottomLeft ? `${props.borderBottomLeft.radius}px` : '0'};
  ${props => props.selectable ? "" : "border: dashed 1px gray;"}

  &:hover {
    background-color: ${props => props.hoverColor};
  }
`;

const BorderComponent = styled.div<{
  width: number,
  height: number,
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
  cursor: string,
}>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  top: ${props => props.top == null ? 'unset' : `${props.top}px`};
  right: ${props => props.right == null ? 'unset' : `${props.right}px`};
  bottom: ${props => props.bottom == null ? 'unset' : `${props.bottom}px`};
  left: ${props => props.left == null ? 'unset' : `${props.left}px`};
  cursor: ${props => props.cursor};
`;

type Props = {
  baseWidth: number;
  baseHeight: number;
  offsetX: number;
  offsetY: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  selectable?: boolean;
  isSelected?: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseClick?: VoidFunction;
  onTopClick?: VoidFunction;
  onRightClick?: VoidFunction;
  onBottomClick?: VoidFunction;
  onLeftClick?: VoidFunction;
  color: string;
  hoverColor?: string;
  borderTopLeft?: Border;
  borderTopRight?: Border;
  borderBottomRight?: Border;
  borderBottomLeft?: Border;
  children?: React.ReactNode;
}

const InnerWrapper = styled.div`
  span {
    pointer-events: none;
    user-select: none;
  }
`;

export default function ResizableComponent({
                                             baseWidth,
                                             baseHeight,
                                             offsetX,
                                             offsetY,
                                             top,
                                             right,
                                             bottom,
                                             left,
                                             selectable = true,
                                             isSelected = false,
                                             onMouseDown,
                                             onMouseClick,
                                             onTopClick,
                                             onRightClick,
                                             onBottomClick,
                                             onLeftClick,
                                             color,
                                             hoverColor = color,
                                             borderTopLeft,
                                             borderTopRight,
                                             borderBottomRight,
                                             borderBottomLeft,
                                             children,
                                           }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Wrapper ref={ref} bgColor={color} width={baseWidth + left + right} height={baseHeight + top + bottom} top={offsetY}
             hoverColor={hoverColor} borderTopLeft={borderTopLeft} borderTopRight={borderTopRight}
             borderBottomRight={borderBottomRight} borderBottomLeft={borderBottomLeft}
             left={offsetX} selectable={selectable} onMouseDown={onMouseDown} onClick={onMouseClick}
             isSelected={isSelected}>
      <BorderComponent id={'resta-resize-top'} cursor={isSelected ? 'row-resize' : 'pointer'}
              width={baseWidth + left + right} height={top} top={0} left={0} onClick={onTopClick}/>
      <BorderComponent id={'resta-resize-right'} cursor={isSelected ? 'col-resize' : 'pointer'} width={right}
              height={baseHeight + top + bottom} top={0} right={0} onClick={onRightClick}/>
      <BorderComponent id={'resta-resize-bottom'} cursor={isSelected ? 'row-resize' : 'pointer'}
              width={baseWidth + left + right} height={bottom} bottom={0} left={0} onClick={onLeftClick}/>
      <BorderComponent id={'resta-resize-left'} cursor={isSelected ? 'col-resize' : 'pointer'} width={left}
              height={baseHeight + top + bottom} top={0} left={0} onClick={onBottomClick}/>
      <InnerWrapper>
        {children}
      </InnerWrapper>
    </Wrapper>
  )
}