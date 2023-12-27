import styled from 'styled-components';
import React, { useRef } from 'react';
import { Typography } from 'antd';

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
  cursor: ${props => props.selectable ? 'pointer' : 'default'};
  box-shadow: ${props => props.isSelected ? '0 0 0 2px #00B7EE' : 'none'};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  border-top-left-radius: ${props => props.borderTopLeft ? `${props.borderTopLeft.radius}px` : '0'};
  border-top-right-radius: ${props => props.borderTopRight ? `${props.borderTopRight.radius}px` : '0'};
  border-bottom-right-radius: ${props => props.borderBottomRight ? `${props.borderBottomRight.radius}px` : '0'};
  border-bottom-left-radius: ${props => props.borderBottomLeft ? `${props.borderBottomLeft.radius}px` : '0'};

  ${props => props.selectable ? '' : 'border: dashed 1px gray;'}
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

const SizeWrapper = styled.div<{
  size: number,
  width: number,
  height: number,
  direction: 'top' | 'right' | 'bottom' | 'left',
}>`
  position: absolute;
  top: ${props => props.direction === 'right' ? `${props.height}px` : props.direction === 'top' ? '0' : 'unset'};
  bottom: ${props => props.direction === 'left' ? `${props.height}px` : props.direction === 'bottom' ? '0' : 'unset'};
  left: ${props => props.direction === 'bottom' ? `${props.width}px` : props.direction === 'left' ? '0' : 'unset'};
  right: ${props => props.direction === 'top' ? `${props.width}px` : props.direction === 'right' ? '0' : 'unset'};
  display: flex;
  justify-content: ${props => props.direction === 'top' || props.direction === 'bottom' ? 'center' : 'center'};
  align-items: ${props => props.direction === 'right' || props.direction === 'bottom' ? 'flex-end' : 'flex-start'};
  flex-direction: ${props => props.direction === 'left' ? 'column' : props.direction === 'right' ? 'column-reverse' : props.direction === 'top' ? 'row' : 'row-reverse'};
  pointer-events: none;
  z-index: 11;
`;

const SizeText = styled.span`
  white-space: nowrap;
  font-size: 1.0rem;
  margin: auto;
`;

const Meter = styled.div<{
  size: number,
  direction: 'top' | 'right' | 'bottom' | 'left',
}>`
  min-width: ${props => props.direction === 'left' || props.direction === 'right' ? `${props.size}px` : '10px'};
  min-height: ${props => props.direction === 'top' || props.direction === 'bottom' ? `${props.size}px` : '10px'};
  border-top: ${props => props.direction === 'top' || props.direction === 'bottom' ? 'dashed 1px black' : 'none'};
  border-right: ${props => props.direction === 'left' || props.direction === 'right' ? 'dashed 1px black' : 'none'};
  border-bottom: ${props => props.direction === 'top' || props.direction === 'bottom' ? 'dashed 1px black' : 'none'};
  border-left: ${props => props.direction === 'left' || props.direction === 'right' ? 'dashed 1px black' : 'none'};
`;

const Size = ({ size, actualSize, width, height, direction }: {
  size: number;
  actualSize: number;
  width: number;
  height: number;
  direction: 'top' | 'right' | 'bottom' | 'left';
}) => {
  const { Text } = Typography;
  return (
    <SizeWrapper size={size} width={width} height={height} direction={direction}>
      <SizeText><Text>{actualSize}</Text></SizeText>
      <Meter size={size} direction={direction} />
    </SizeWrapper>
  );
};

type Props = {
  baseWidth: number;
  baseHeight: number;
  offsetX: number;
  offsetY: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  actualTop?: number;
  actualRight?: number;
  actualBottom?: number;
  actualLeft?: number;
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
                                             actualTop = 0,
                                             actualRight = 0,
                                             actualBottom = 0,
                                             actualLeft = 0,
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
                                             children
                                           }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Wrapper ref={ref} bgColor={color} width={baseWidth + left + right} height={baseHeight + top + bottom} top={offsetY}
             hoverColor={hoverColor} borderTopLeft={borderTopLeft} borderTopRight={borderTopRight}
             borderBottomRight={borderBottomRight} borderBottomLeft={borderBottomLeft}
             left={offsetX} selectable={selectable} onMouseDown={onMouseDown} onClick={onMouseClick}
             isSelected={isSelected}>
      {isSelected && <>
        <Size size={top} actualSize={actualTop} width={baseWidth + left + right} height={baseHeight + bottom} direction={'top'} />
        <Size size={right} actualSize={actualRight} width={baseWidth + left + right} height={baseHeight + top + bottom} direction={'right'} />
        <Size size={bottom} actualSize={actualBottom} width={baseWidth + left + right} height={baseHeight + top + bottom} direction={'bottom'} />
        <Size size={left} actualSize={actualLeft} width={baseWidth + right} height={baseHeight + top + bottom} direction={'left'} />
      </>}
      <BorderComponent id={'resta-resize-top'} cursor={isSelected ? 'row-resize' : 'pointer'}
                       width={baseWidth + left + right} height={top} top={0} left={0} onClick={onTopClick} />
      <BorderComponent id={'resta-resize-right'} cursor={isSelected ? 'col-resize' : 'pointer'} width={right}
                       height={baseHeight + top + bottom} top={0} right={0} onClick={onRightClick} />
      <BorderComponent id={'resta-resize-bottom'} cursor={isSelected ? 'row-resize' : 'pointer'}
                       width={baseWidth + left + right} height={bottom} bottom={0} left={0} onClick={onLeftClick} />
      <BorderComponent id={'resta-resize-left'} cursor={isSelected ? 'col-resize' : 'pointer'} width={left}
                       height={baseHeight + top + bottom} top={0} left={0} onClick={onBottomClick} />
      <InnerWrapper>
        {children}
      </InnerWrapper>
    </Wrapper>
  );
}