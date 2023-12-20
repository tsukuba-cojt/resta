import React, { SetStateAction, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import StylerTabContent from './StylerTabContent';
import type { Color } from 'antd/es/color-picker';
import { ColorPicker, Typography } from 'antd';

const DEFAULT_COLOR = 'rgba(0, 0, 0, 255)';

const Wrapper = styled.div`
  width: 100%;
`;

const ColorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const Description = styled.p`
  font-size: 0.7rem;
  text-align: right;
`;

const Color = ({ onChange, value }: { onChange: (c: string | Color | undefined) => void, value: string }) => {
  const { Text } = Typography;

  return (
    <ColorWrapper>
      <ColorPicker
        allowClear
        size='small'
        value={value}
        onChangeComplete={(c) => {
          onChange(c);
        }}
      />
      <Description>
        <Text type='secondary'>{value}</Text>
      </Description>
    </ColorWrapper>
  );
};

type Props = {
  topValue?: Border;
  rightValue?: Border;
  bottomValue?: Border;
  leftValue?: Border;
  setTopValue: React.Dispatch<React.SetStateAction<Border | undefined>>;
  setRightValue: React.Dispatch<React.SetStateAction<Border | undefined>>;
  setBottomValue: React.Dispatch<React.SetStateAction<Border | undefined>>;
  setLeftValue: React.Dispatch<React.SetStateAction<Border | undefined>>;
}

export default function BorderStylerTabContent({
                                                 topValue,
                                                 rightValue,
                                                 bottomValue,
                                                 leftValue,
                                                 setTopValue,
                                                 setRightValue,
                                                 setBottomValue,
                                                 setLeftValue
                                               }: Props) {

  const [direction, setDirection] = useState<'top' | 'right' | 'bottom' | 'left'>('top');

  const updateBorder = useCallback((dest: Border | undefined, setter: React.Dispatch<React.SetStateAction<Border | undefined>>, {
    width,
    type,
    color,
    radius
  }: Partial<Border>): Border => {
    const newValue = dest == null
      ? {
        width: width != null ? width : 0,
        type: type != null ? type : 'solid',
        color: color != null ? color : DEFAULT_COLOR,
        radius: radius != null ? radius : 0
      }
      : {
        width: width != null ? width : dest.width,
        type: type != null ? type : dest.type,
        color: color != null ? color : dest.color,
        radius: radius != null ? radius : dest.radius
      };
    setter(newValue);
    return newValue;
  }, []);

  const setTopWidth = useCallback((width: SetStateAction<number>) => {
    if (typeof width === 'number') {
      updateBorder(topValue, setTopValue, { width: width });
    }
  }, [topValue, setTopValue, direction]);

  const setRightWidth = useCallback((width: SetStateAction<number>) => {
    if (typeof width === 'number') {
      updateBorder(rightValue, setRightValue, { width: width });
    }
  }, [rightValue, setRightValue, direction]);

  const setBottomWidth = useCallback((width: SetStateAction<number>) => {
    if (typeof width === 'number') {
      updateBorder(bottomValue, setBottomValue, { width: width });
    }
  }, [bottomValue, setBottomValue, direction]);

  const setLeftWidth = useCallback((width: SetStateAction<number>) => {
    if (typeof width === 'number') {
      updateBorder(leftValue, setLeftValue, { width: width });
    }
  }, [leftValue, setLeftValue, direction]);

  const currentColor = useMemo((): string => {
    switch (direction) {
      case 'top':
        return topValue?.color ?? DEFAULT_COLOR;
      case 'right':
        return rightValue?.color ?? DEFAULT_COLOR;
      case 'bottom':
        return bottomValue?.color ?? DEFAULT_COLOR;
      case 'left':
        return leftValue?.color ?? DEFAULT_COLOR;
      default:
        return DEFAULT_COLOR;
    }
  }, [direction, topValue, rightValue, bottomValue, leftValue]);

  const onChangeColor = useCallback((color: string | Color | undefined) => {
    if (color == null) {
      return;
    }

    const colorText = typeof color === 'string' ? color : color.toRgbString();
    switch (direction) {
      case 'top':
        updateBorder(topValue, setTopValue, { color: colorText });
        break;
      case 'right':
        updateBorder(rightValue, setRightValue, { color: colorText });
        break;
      case 'bottom':
        updateBorder(bottomValue, setBottomValue, { color: colorText });
        break;
      case 'left':
        updateBorder(leftValue, setLeftValue, { color: colorText });
        break;
    }
  }, [topValue, rightValue, bottomValue, leftValue, setTopValue, setRightValue, setBottomValue, setLeftValue, direction]);

  const additionalContents = {
    '色': <Color value={currentColor} onChange={onChangeColor} />,
  }

  return (
    <Wrapper>
      <StylerTabContent topValue={topValue?.width}
                        rightValue={rightValue?.width}
                        bottomValue={bottomValue?.width}
                        leftValue={leftValue?.width}
                        setTopValue={setTopWidth} setRightValue={setRightWidth}
                        setBottomValue={setBottomWidth} setLeftValue={setLeftWidth}
                        topColor={topValue?.color} rightColor={rightValue?.color}
                        bottomColor={bottomValue?.color} leftColor={leftValue?.color}
                        additionalContents={additionalContents}
                        onDirectionChange={setDirection} />
    </Wrapper>
  );
}