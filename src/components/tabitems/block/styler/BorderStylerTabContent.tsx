import React, { SetStateAction, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import StylerTabContent from './StylerTabContent';
import type { Color } from 'antd/es/color-picker';
import { Select, Typography } from 'antd';
import useStyleApplier from '../../../../hooks/useStyleApplier';
import { DefaultOptionType } from 'antd/es/select';
import ColorPicker2 from '../../../controls/ColorPicker2';

const Wrapper = styled.div`
  width: 100%;
`;

const Description = styled.p`
  font-size: 0.7rem;
  text-align: right;
`;

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
  additionalContents?: Record<string, [React.ReactNode, ((value: any) => void)]>
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
                                                 setLeftValue,
                                                 additionalContents = {},
                                               }: Props) {

  const styleApplier = useStyleApplier();

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

  const applyBorder = useCallback((directions: Direction[], border: Border | number | undefined) => {
    for (const direction of directions) {
      let b: Border;
      if (border == null || typeof border === 'number') {
        b = { ...getValueByDirection(direction), width: border };
        console.log(1, b)
      } else {
        b = border;
      }
      styleApplier.applyStyle(`border-${direction}`, `${b.width}px ${b.style} ${b.color}`);
    }
  }, [styleApplier, getValueByDirection, topValue, rightValue, bottomValue, leftValue]);

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
    applyBorder([direction], border);
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
  }, [topValue, rightValue, bottomValue, leftValue, directions, getValueByDirection]);

  /**
   * 色が変更されたときの処理
   */
  const onChangeColor = useCallback((color: string | Color | undefined) => {
    const colorText = typeof color === 'string' || typeof color == 'undefined' ? color : color.toRgbString();
    for (const direction of directions) {
      setValueByDirection(direction, { ...getValueByDirection(direction), color: colorText });
    }
  }, [topValue, rightValue, bottomValue, leftValue, directions, setValueByDirection, getValueByDirection]);

  /**
   * 枠線スタイルが変更されたときの処理
   */
  const onChangeStyle = useCallback((style: BorderStyle) => {
    for (const direction of directions) {
      setValueByDirection(direction, { ...getValueByDirection(direction), style });
    }
  }, [topValue, rightValue, bottomValue, leftValue, directions, setValueByDirection, getValueByDirection]);

  /**
   * 角丸が変更されたときの処理
   */
  const onChangeRadius = useCallback((value: number | undefined) => {
    for (const direction of directions) {
      setValueByDirection(direction, { ...getValueByDirection(direction), radius: value });
    }
  }, [topValue, rightValue, bottomValue, leftValue, directions, setValueByDirection, getValueByDirection]);

  /**
   * 枠線幅が変更されたときの処理
   */
  const onChangeWidth = useCallback((value: number | undefined) => {
    for (const direction of directions) {
      setValueByDirection(direction, { ...getValueByDirection(direction), width: value });
    }
  }, [topValue, rightValue, bottomValue, leftValue, directions, setValueByDirection, getValueByDirection]);

  /**
   * 現在選択されている方向の値を取得する
   * すべての方向が同じ値を持っている場合はその値を、そうでない場合には undefined を返す
   */
  const borderStyle = useMemo(() => {
    if (directions.length > 1) {
      let isAllSame = true;
      let previousValue = getValueByDirection(directions[0]).style;

      for (const direction of directions) {
        isAllSame = previousValue === getValueByDirection(direction).style;
        if (!isAllSame) {
          return undefined;
        }
      }

      return previousValue;

    } else if (directions.length === 0) {
      return undefined;
    }

    return getValueByDirection(directions[0]).style;
  }, [topValue, rightValue, bottomValue, leftValue, directions, setValueByDirection, getValueByDirection]);

  /**
   * 枠線スタイルの選択肢
   */
  const borderStyleOptions: DefaultOptionType[] = [
    { value: 'none', label: 'なし' },
    { value: 'solid', label: '実線' },
    { value: 'dashed', label: '破線' },
    { value: 'dotted', label: '点線' },
    { value: 'double', label: '二重線' },
    { value: 'groove', label: '浮き出し線' },
    { value: 'ridge', label: '浮き出し線' },
    { value: 'inset', label: 'インセット線' },
    { value: 'outset', label: 'アウトセット線' }
  ];

  /**
   * 追加のコンテンツ
   */
  const _additionalContents: Record<string, [React.ReactNode, ((value: any) => void)]> = {
    '色': [<ColorPicker2 value={currentColor} onChange={onChangeColor} />, onChangeColor],
    'スタイル': [<Select size={'small'} bordered={false} options={borderStyleOptions} defaultValue={undefined} value={borderStyle}
                     onChange={onChangeStyle} style={{minWidth: '130px', textAlign: 'right'}} />, onChangeStyle],
    '角丸': [
      <BorderRadius topValue={topValue.radius} rightValue={rightValue.radius} bottomValue={bottomValue.radius}
                    leftValue={leftValue.radius} />, onChangeRadius],
    ...additionalContents
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
                        additionalContents={_additionalContents}
                        onDirectionChange={setDirections}
                        onChange={onChangeWidth} />
    </Wrapper>
  );
}