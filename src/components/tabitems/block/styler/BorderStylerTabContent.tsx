import React, { SetStateAction, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import StylerTabContent from './StylerTabContent';
import type { Color } from 'antd/es/color-picker';
import { ColorPicker, Typography } from 'antd';

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

const Color = ({ onChange, value }: {
  onChange: (c: string | Color | undefined) => void,
  value: string | undefined
}) => {
  const { Text } = Typography;

  return (
    <ColorWrapper>
      <ColorPicker
        size='small'
        value={value}
        onChangeComplete={(c) => {
          onChange(c);
        }}
      />
      <Description>
        {value && <Text type='secondary'>{value}</Text>}
        {value == undefined && <Text type='secondary'>未設定</Text>}
      </Description>
    </ColorWrapper>
  );
};

const BorderRadius = ({ topValue, rightValue, bottomValue, leftValue }:
                        {
                          topValue: number | undefined;
                          rightValue: number | undefined;
                          bottomValue: number | undefined;
                          leftValue: number | undefined;
                        }) => {
    const { Text } = Typography;

    return (
      <div>
        <Description>
          <Text type='secondary'>
            {topValue != null ? topValue : '_'}, {rightValue != null ? rightValue : '_'}, {bottomValue != null ? bottomValue : '_'}, {leftValue != null ? leftValue : '_'}
          </Text>
        </Description>
      </div>
    );
  }
;

type Props = {
  topValue: Border;
  rightValue: Border;
  bottomValue: Border;
  leftValue: Border;
  setTopValue: React.Dispatch<React.SetStateAction<Border>>;
  setRightValue: React.Dispatch<React.SetStateAction<Border>>;
  setBottomValue: React.Dispatch<React.SetStateAction<Border>>;
  setLeftValue: React.Dispatch<React.SetStateAction<Border>>;
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

  const setTopWidth = useCallback((width: SetStateAction<number | undefined>) => {
    setTopValue({ ...topValue, width: width as number | undefined });
  }, [topValue, setTopValue, direction]);

  const setRightWidth = useCallback((width: SetStateAction<number | undefined>) => {
    setRightValue({ ...rightValue, width: width as number | undefined });
  }, [rightValue, setRightValue, direction]);

  const setBottomWidth = useCallback((width: SetStateAction<number | undefined>) => {
    setBottomValue({ ...bottomValue, width: width as number | undefined });
  }, [bottomValue, setBottomValue, direction]);

  const setLeftWidth = useCallback((width: SetStateAction<number | undefined>) => {
    setLeftValue({ ...leftValue, width: width as number | undefined });
  }, [leftValue, setLeftValue, direction]);

  const currentColor = useMemo((): string | undefined => {
    switch (direction) {
      case 'top':
        return topValue?.color;
      case 'right':
        return rightValue?.color;
      case 'bottom':
        return bottomValue?.color;
      case 'left':
        return leftValue?.color;
      default:
        return undefined;
    }
  }, [direction, topValue, rightValue, bottomValue, leftValue]);

  const onChangeColor = useCallback((color: string | Color | undefined) => {
    const colorText = typeof color === 'string' || typeof color == 'undefined' ? color : color.toRgbString();
    switch (direction) {
      case 'top':
        setTopValue({ ...leftValue, color: colorText as string | undefined });
        break;
      case 'right':
        setRightValue({ ...rightValue, color: colorText as string | undefined });
        break;
      case 'bottom':
        setBottomValue({ ...bottomValue, color: colorText as string | undefined });
        break;
      case 'left':
        setLeftValue({ ...leftValue, color: colorText as string | undefined });
        break;
    }
  }, [topValue, rightValue, bottomValue, leftValue, setTopValue, setRightValue, setBottomValue, setLeftValue, direction]);

  const onChangeRadius = useCallback((value: number | undefined) => {
    switch (direction) {
      case 'top':
        setTopValue({ ...leftValue, radius: value as number | undefined });
        break;
      case 'right':
        setRightValue({ ...rightValue, radius: value as number | undefined });
        break;
      case 'bottom':
        setBottomValue({ ...bottomValue, radius: value as number | undefined });
        break;
      case 'left':
        setLeftValue({ ...leftValue, radius: value as number | undefined });
        break;
    }
  }, [topValue, rightValue, bottomValue, leftValue, setTopValue, setRightValue, setBottomValue, setLeftValue, direction]);

  const additionalContents: Record<string, [React.ReactNode, ((value: any) => void)]> = {
    '角丸': [
      <BorderRadius topValue={topValue.radius} rightValue={rightValue.radius} bottomValue={bottomValue.radius}
                    leftValue={leftValue.radius} />, onChangeRadius],
    '色': [<Color value={currentColor} onChange={onChangeColor} />, onChangeColor]
  };

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