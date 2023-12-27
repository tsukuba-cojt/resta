import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Col, InputNumber, Row, Select, Slider, Typography } from 'antd';
import { spaceUnits } from '../../../../consts/units';
import { DeleteOutlined } from '@ant-design/icons';

const DIRECTION_BUTTON_WIDTH = 45;
const DIRECTION_BUTTON_HEIGHT = 8;

const Wrapper = styled.div`
  width: 100%;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DirectionSetter = styled.div<{
  topColor?: string;
  rightColor?: string;
  bottomColor?: string;
  leftColor?: string;
}>`
  position: relative;
  flex: 0;
  width: ${DIRECTION_BUTTON_WIDTH}px;
  height: ${DIRECTION_BUTTON_WIDTH}px;
  box-sizing: border-box;
  border-top: ${props => `${DIRECTION_BUTTON_HEIGHT}px solid ${props.topColor ?? 'lightgray'}`};
  border-right: ${props => `${DIRECTION_BUTTON_HEIGHT}px solid ${props.rightColor ?? 'lightgray'}`};
  border-bottom: ${props => `${DIRECTION_BUTTON_HEIGHT}px solid ${props.bottomColor ?? 'lightgray'}`};
  border-left: ${props => `${DIRECTION_BUTTON_HEIGHT}px solid ${props.leftColor ?? 'lightgray'}`};
`;

const DirectionButton = styled.button<{
  width: number;
  height: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  selected: boolean;
}>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  top: ${props => props.top == null ? 'unset' : `${props.top - DIRECTION_BUTTON_HEIGHT}px`};
  right: ${props => props.right == null ? 'unset' : `${props.right - DIRECTION_BUTTON_HEIGHT}px`};
  bottom: ${props => props.bottom == null ? 'unset' : `${props.bottom - DIRECTION_BUTTON_HEIGHT}px`};
  left: ${props => props.left == null ? 'unset' : `${props.left - DIRECTION_BUTTON_HEIGHT}px`};
  box-shadow: ${props => props.selected ? '0px 0px 16px -4px #000000' : 'none'};
  background-color: ${props => props.selected ? '#00b7ee' : 'transparent'};
  outline: none;
  border: none;
  z-index: ${props => props.selected ? 10 : 0};
  padding: 0;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const AdditionalContentText = styled.p`
  font-size: 0.7rem;
  text-align: right;
  white-space: nowrap;
`;

const AdditionalContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

type Props = {
  topValue?: number;
  rightValue?: number;
  bottomValue?: number;
  leftValue?: number;
  setTopValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setRightValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setBottomValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setLeftValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  topColor?: string;
  rightColor?: string;
  bottomColor?: string;
  leftColor?: string;
  additionalContents?: { [name: string]: [React.ReactNode, ((value: any) => void)] };
  onDirectionChange?: (direction: 'top' | 'right' | 'bottom' | 'left') => void;
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
                                           leftColor,
                                           additionalContents = {},
                                           onDirectionChange = () => {
                                           }
                                         }: Props) {
  const [direction, setDirection] = React.useState<'top' | 'right' | 'bottom' | 'left'>('top');

  const _onDirectionChange = useCallback((direction: 'top' | 'right' | 'bottom' | 'left') => {
    onDirectionChange(direction);
    setDirection(direction);
  }, [direction, onDirectionChange]);

  const onChange = useCallback((value: number | null | undefined) => {
    if (value == null) {
      value = undefined;
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

  const onResetClick = useCallback(() => {
    onChange(undefined);
  }, [onChange]);

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
          <DirectionSetter topColor={topColor} rightColor={rightColor} bottomColor={bottomColor} leftColor={leftColor}>
            <DirectionButton width={DIRECTION_BUTTON_WIDTH} height={DIRECTION_BUTTON_HEIGHT} top={0} left={0}
                             selected={direction === 'top'}
                             onClick={() => _onDirectionChange('top')} />
            <DirectionButton width={DIRECTION_BUTTON_HEIGHT} height={DIRECTION_BUTTON_WIDTH} top={0} right={0}
                             selected={direction === 'right'}
                             onClick={() => _onDirectionChange('right')} />
            <DirectionButton width={DIRECTION_BUTTON_WIDTH} height={DIRECTION_BUTTON_HEIGHT} bottom={0} left={0}
                             selected={direction === 'bottom'}
                             onClick={() => _onDirectionChange('bottom')} />
            <DirectionButton width={DIRECTION_BUTTON_HEIGHT} height={DIRECTION_BUTTON_WIDTH} top={0} left={0}
                             selected={direction === 'left'}
                             onClick={() => _onDirectionChange('left')} />
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

      <AdditionalContent>
        <AdditionalContentText>
          <Text type='secondary'>サイズ</Text>
        </AdditionalContentText>
        <Flex>
          <AdditionalContentText>
            <Text type='secondary'>
              {topValue != null ? topValue : '_'}, {rightValue != null ? rightValue : '_'}, {bottomValue != null ? bottomValue : '_'}, {leftValue != null ? leftValue : '_'}
            </Text>
          </AdditionalContentText>
          <Button type='link' size='small' onClick={onResetClick}>
            <DeleteOutlined width={16} color={'rgba(0, 0, 0, 0.45)'} />
          </Button>
        </Flex>
      </AdditionalContent>

      {Object.entries(additionalContents).map(([name, content], index) => (
        <AdditionalContent key={index}>
          <AdditionalContentText>
            <Text type='secondary'>{name}</Text>
          </AdditionalContentText>
          <Flex>
            {content[0]}
            <Button type='link' size='small' onClick={() => content[1](undefined)}>
              <DeleteOutlined width={16} color={'rgba(0, 0, 0, 0.45)'} />
            </Button>
          </Flex>
        </AdditionalContent>
      ))}
    </Wrapper>
  );
}