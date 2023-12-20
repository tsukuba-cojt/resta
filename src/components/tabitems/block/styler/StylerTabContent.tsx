import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Col, InputNumber, Row, Select, Slider, Typography } from 'antd';
import { spaceUnits } from '../../../../consts/units';

const DIRECTION_BUTTON_WIDTH = 45;
const DIRECTION_BUTTON_HEIGHT = 8;

const Wrapper = styled.div`
  width: 100%;
`;

const DirectionSetter = styled.div`
  position: relative;
  flex: 0;
  width: ${DIRECTION_BUTTON_WIDTH}px;
  height: ${DIRECTION_BUTTON_WIDTH}px;
`;

const DirectionButton = styled.button<{
  width: number;
  height: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  selected: boolean;
  color?: string;
}>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  top: ${props => props.top == null ? 'unset' : `${props.top}px`};
  right: ${props => props.right == null ? 'unset' : `${props.right}px`};
  bottom: ${props => props.bottom == null ? 'unset' : `${props.bottom}px`};
  left: ${props => props.left == null ? 'unset' : `${props.left}px`};
  box-shadow: ${props => props.selected ? '0px 0px 16px -4px #000000' : 'none'};
  background-color: ${props => props.selected && props.color ? props.color : (!props.selected && props.color ? props.color : (props.selected ? '#00b7ee' : 'lightgray'))};
  outline: none;
  border: none;
  z-index: ${props => props.selected ? 10 : 0};

  &:focus {
    outline: none;
  }
`;

const Description = styled.p`
  font-size: 0.7rem;
  margin-top: 8px;
  text-align: right;
`;

type Props = {
  topValue: number;
  rightValue: number;
  bottomValue: number;
  leftValue: number;
  setTopValue: React.Dispatch<React.SetStateAction<number>>;
  setRightValue: React.Dispatch<React.SetStateAction<number>>;
  setBottomValue: React.Dispatch<React.SetStateAction<number>>;
  setLeftValue: React.Dispatch<React.SetStateAction<number>>;
  topColor?: string;
  rightColor?: string;
  bottomColor?: string;
  leftColor?: string;
}

export default function StylerTabContent({
                                           topValue,
                                           rightValue,
                                           bottomValue,
                                           leftValue,
                                           setTopValue,
                                           setRightValue,
                                           setBottomValue,
                                           setLeftValue,
                                           topColor,
                                           rightColor,
                                           bottomColor,
                                           leftColor
                                         }: Props) {
  const [direction, setDirection] = React.useState<'top' | 'right' | 'bottom' | 'left'>('top');

  const onChange = useCallback((value: number | null) => {
    if (value == null) {
      return;
    }

    switch (direction) {
      case 'top':
        setTopValue(value);
        break;
      case 'right':
        setRightValue(value);
        break;
      case 'bottom':
        setBottomValue(value);
        break;
      case 'left':
        setLeftValue(value);
        break;
    }
  }, [direction, setTopValue, setRightValue, setBottomValue, setLeftValue]);

  const value = useMemo(() => {
    switch (direction) {
      case 'top':
        return topValue;
      case 'right':
        return rightValue;
      case 'bottom':
        return bottomValue;
      case 'left':
        return leftValue;
    }
  }, [direction, topValue, rightValue, bottomValue, leftValue]);

  const { Text } = Typography;
  const { Option } = Select;

  const UnitSelect = (
    <Select defaultValue='px' style={{ width: 60 }}>
      {spaceUnits.map(unit => <Option value={unit}>{unit}</Option>)}
    </Select>
  );

  return (
    <Wrapper>
      <Row gutter={[8, 0]} align={'middle'}>
        <Col span={5}>
          <DirectionSetter>
            <DirectionButton width={DIRECTION_BUTTON_WIDTH} height={DIRECTION_BUTTON_HEIGHT} top={0} left={0}
                             color={topColor} selected={direction === 'top'} onClick={() => setDirection('top')} />
            <DirectionButton width={DIRECTION_BUTTON_HEIGHT} height={DIRECTION_BUTTON_WIDTH} top={0} right={0}
                             color={rightColor} selected={direction === 'right'}
                             onClick={() => setDirection('right')} />
            <DirectionButton width={DIRECTION_BUTTON_WIDTH} height={DIRECTION_BUTTON_HEIGHT} bottom={0} left={0}
                             color={bottomColor} selected={direction === 'bottom'}
                             onClick={() => setDirection('bottom')} />
            <DirectionButton width={DIRECTION_BUTTON_HEIGHT} height={DIRECTION_BUTTON_WIDTH} top={0} left={0}
                             color={leftColor} selected={direction === 'left'} onClick={() => setDirection('left')} />
          </DirectionSetter>
        </Col>
        <Col span={8}>
          <Slider
            min={0}
            max={25}
            onChange={onChange}
            value={value}
          />
        </Col>
        <Col span={11}>
          <InputNumber addonAfter={UnitSelect} defaultValue={0} onChange={onChange} value={value} />
        </Col>
      </Row>
      <Description>
        <Text type="secondary">上, 右, 下, 左 = {topValue}, {rightValue}, {bottomValue}, {leftValue}</Text>
      </Description>
    </Wrapper>
  );
}