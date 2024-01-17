import styled from 'styled-components';
import { ColorPicker, Typography } from 'antd';
import React from 'react';
import { Color } from 'antd/es/color-picker';

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
 * 全ての値が同じでないことを示す値
 */
const NOT_ALL_SAME = '_NOT_ALL_SAME';

/**
 * カラーピッカーと色の値を表示するコンポーネント
 */
export default function ColorPicker2({ onChange, value }: {
  onChange: (c: string | Color | undefined) => void,
  value: string | Color | undefined
}) {
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
        {value && value !== NOT_ALL_SAME && <Text type='secondary'>{typeof value === 'object' ? value.toRgbString() : value ?? '#FFFFFF'}</Text>}
        {value === NOT_ALL_SAME && <Text type='secondary'>決定できません</Text>}
        {value == undefined && <Text type='secondary'>未選択</Text>}
      </Description>
    </ColorWrapper>
  );
};