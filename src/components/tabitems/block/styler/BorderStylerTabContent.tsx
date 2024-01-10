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

/**
 * カラーピッカーと色の値を表示するコンポーネント
 */
const Color = ({ onChange, value }: {
  onChange: (c: string | Color | undefined) => void,
  value: string | undefined
}) => {
  const { Text } = Typography;

  return (
    <ColorWrapper>
      <ColorPicker
        size='small'
        value={value !== NOT_ALL_SAME ? value : undefined}
        onChangeComplete={(c) => {
          onChange(c);
        }}
      />
      <Description>
        {value && value !== NOT_ALL_SAME && <Text type='secondary'>{value}</Text>}
        {value === NOT_ALL_SAME && <Text type='secondary'>決定できません</Text>}
        {value == undefined && <Text type='secondary'>未選択</Text>}
      </Description>
    </ColorWrapper>
  );
};

/**
 * 角丸の値を表示するコンポーネント
 */
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

/**
 * 全ての値が同じでないことを示す値
 */
const NOT_ALL_SAME = '_NOT_ALL_SAME';

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

/**
 * 枠線と角丸タブのコンテンツ
 */
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

  /**
   * 選択されている方向
   */
  const [directions, setDirections] = useState<Direction[]>(['top', 'right', 'bottom', 'left']);

  /**
   * 指定された方向の値を取得する
   */
  const getValueByDirection = useCallback((direction: Direction) => {
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
  }, [topValue, rightValue, bottomValue, leftValue]);

  /**
   * 指定された方向の値を設定する
   */
  const setValueByDirection = useCallback((direction: Direction, border: Border) => {
    switch (direction) {
      case 'top':
        setTopValue(border);
        break;
      case 'right':
        setRightValue(border);
        break;
      case 'bottom':
        setBottomValue(border);
        break;
      case 'left':
        setLeftValue(border);
        break;
    }
  }, [topValue, rightValue, bottomValue, leftValue]);

  /**
   * 指定された方向の幅を設定する
   */
  const setTopWidth = useCallback((width: SetStateAction<number | undefined>) => {
    setTopValue({ ...topValue, width: width as number | undefined });
  }, [topValue, setTopValue, directions]);

  const setRightWidth = useCallback((width: SetStateAction<number | undefined>) => {
    setRightValue({ ...rightValue, width: width as number | undefined });
  }, [rightValue, setRightValue, directions]);

  const setBottomWidth = useCallback((width: SetStateAction<number | undefined>) => {
    setBottomValue({ ...bottomValue, width: width as number | undefined });
  }, [bottomValue, setBottomValue, directions]);

  const setLeftWidth = useCallback((width: SetStateAction<number | undefined>) => {
    setLeftValue({ ...leftValue, width: width as number | undefined });
  }, [leftValue, setLeftValue, directions]);

  /**
   * 現在指定されている方向の色
   * 全ての方向が同じ色であればその色を、そうでなければ undefined を返す
   */
  const currentColor = useMemo((): string | undefined => {
    if (directions.length > 1) {
      let isAllSame = true;
      let previousColor = getValueByDirection(directions[0]).color;

      for (const direction of directions) {
        isAllSame = previousColor === getValueByDirection(direction).color;
        if (!isAllSame) {
          return NOT_ALL_SAME;
        }
      }

      return previousColor;

    } else if (directions.length === 0) {
      return undefined;
    }

    return getValueByDirection(directions[0]).color;
  }, [directions, topValue, rightValue, bottomValue, leftValue]);

  /**
   * 色が変更されたときの処理
   */
  const onChangeColor = useCallback((color: string | Color | undefined) => {
    const colorText = typeof color === 'string' || typeof color == 'undefined' ? color : color.toRgbString();
    for (const direction of directions) {
      setValueByDirection(direction, { ...getValueByDirection(direction), color: colorText });
    }
  }, [topValue, rightValue, bottomValue, leftValue, setTopValue, setRightValue, setBottomValue, setLeftValue, directions]);

  /**
   * 角丸が変更されたときの処理
   */
  const onChangeRadius = useCallback((value: number | undefined) => {
    for (const direction of directions) {
      setValueByDirection(direction, { ...getValueByDirection(direction), radius: value });
    }
  }, [topValue, rightValue, bottomValue, leftValue, setTopValue, setRightValue, setBottomValue, setLeftValue, directions]);

  /**
   * 追加のコンテンツ
   */
  const additionalContents: Record<string, [React.ReactNode, ((value: any) => void)]> = {
    '角丸': [
      <BorderRadius topValue={topValue.radius} rightValue={rightValue.radius} bottomValue={bottomValue.radius}
                    leftValue={leftValue.radius} />, onChangeRadius],
    '色': [<Color value={currentColor} onChange={onChangeColor} />, onChangeColor]
  };

  return (
    <Wrapper>
      <StylerTabContent type={'border'} topValue={topValue?.width}
                        rightValue={rightValue?.width}
                        bottomValue={bottomValue?.width}
                        leftValue={leftValue?.width}
                        setTopValue={setTopWidth} setRightValue={setRightWidth}
                        setBottomValue={setBottomWidth} setLeftValue={setLeftWidth}
                        topColor={topValue?.color} rightColor={rightValue?.color}
                        bottomColor={bottomValue?.color} leftColor={leftValue?.color}
                        additionalContents={additionalContents}
                        onDirectionChange={setDirections} />
    </Wrapper>
  );
}