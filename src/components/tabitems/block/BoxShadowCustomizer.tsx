import Flex from '../common/Flex';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Checkbox, Col, ColorPicker, InputNumber, Row, Slider } from 'antd';
import {
  IconArrowsMaximize,
  IconArrowsMoveHorizontal,
  IconArrowsMoveVertical,
  IconBlur,
} from '@tabler/icons-react';
import Section from '../common/Section';
import { createId } from '../../../utils/IDUtils';
import { BgColorsOutlined } from '@ant-design/icons';
import { Color } from 'antd/es/color-picker';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import { kebabToCamel, rgbToHexColor } from '../../../utils/CSSUtils';
import styled from 'styled-components';

const UnitWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface SliderWithInputProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderWithInput = ({
  min = 0,
  max = 100,
  defaultValue,
  value,
  onChange,
}: SliderWithInputProps) => {
  return (
    <Row gutter={16} style={{ width: '100%' }}>
      <Col span={12}>
        <Slider
          min={min}
          max={max}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
        />
      </Col>
      <Col span={8}>
        <InputNumber
          value={value}
          defaultValue={defaultValue}
          onChange={(value) => onChange(value ? value : 0)}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={4}>
        <UnitWrapper>
          <span>px</span>
        </UnitWrapper>
      </Col>
    </Row>
  );
};

interface BoxShadowCustomizerProps {
  onChange: (key: string, value: string, id: number | string) => void;
}

const BoxShadowCustomizer = ({ onChange }: BoxShadowCustomizerProps) => {
  const elementSelection = useContext(ElementSelectionContext);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [horizontalPosition, setHorizontalPosition] = useState<number>(0);
  const [verticalPosition, setVerticalPosition] = useState<number>(0);
  const [blur, setBlur] = useState<number>(3);
  const [expansion, setExpansion] = useState<number>(1);
  const [colorHex, setColorHex] = useState<Color | string>('#333333');
  const [formatHex, setFormatHex] = useState<'rgb' | 'hsb' | 'hex'>('hex');

  const hexString = useMemo(
    () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
    [colorHex]
  );

  const onVerticalPositionChange = (value: number) => {
    setVerticalPosition(value);
    let newValue = 'none';
    if (enabled) {
      newValue = `${horizontalPosition}px ${value}px ${blur}px ${expansion}px ${hexString}`;
    }
    onChange('box-shadow', newValue, createId('box-shadow'));
  };

  const onHorizontalPositionChange = (value: number) => {
    setHorizontalPosition(value);
    let newValue = 'none';
    if (enabled) {
      newValue = `${value}px ${verticalPosition}px ${blur}px ${expansion}px ${hexString}`;
    }
    onChange('box-shadow', newValue, createId('box-shadow'));
  };

  const onBlurChange = (value: number) => {
    setBlur(value);
    let newValue = 'none';
    if (enabled) {
      newValue = `${horizontalPosition}px ${verticalPosition}px ${value}px ${expansion}px ${hexString}`;
    }
    onChange('box-shadow', newValue, createId('box-shadow'));
  };

  const onExpansionChange = (value: number) => {
    setExpansion(value);
    let newValue = 'none';
    if (enabled) {
      newValue = `${horizontalPosition}px ${verticalPosition}px ${blur}px ${value}px ${hexString}`;
    }
    onChange('box-shadow', newValue, createId('box-shadow'));
  };

  const onCheckboxChange = (value: boolean) => {
    setEnabled(value);
    let newValue = 'none';
    if (value) {
      newValue = `${horizontalPosition}px ${verticalPosition}px ${blur}px ${expansion}px ${hexString}`;
    }
    onChange('box-shadow', newValue, createId('box-shadow'));
  };

  const onColorChange = (value: Color | string) => {
    setColorHex(value);
    let newValue = 'none';
    if (enabled) {
      newValue = `${horizontalPosition}px ${verticalPosition}px ${blur}px ${expansion}px ${
        typeof value === 'string' ? value : value.toHexString()
      }`;
      console.log(newValue);
    }
    onChange('box-shadow', newValue, createId('box-shadow'));
  };

  useEffect(() => {
    if (elementSelection.selectedElement) {
      const style = getComputedStyle(elementSelection.selectedElement);
      const value = (style as any)[kebabToCamel('box-shadow')] as string;

      if (value === 'none') {
        setEnabled(false);
        setHorizontalPosition(0);
        setVerticalPosition(0);
        setBlur(3);
        setExpansion(1);
        return;
      }

      const numbers = [...value.matchAll(/(-?\d+)px/g)].map((value) =>
        parseFloat(value[1])
      );

      setEnabled(true);
      setHorizontalPosition(numbers[0]);
      setVerticalPosition(numbers[1]);
      setBlur(numbers[2]);
      setExpansion(numbers[3]);

      const rgb = value.match(/\(\d+,\s*\d+,\s*\d+(,\s*\d+)?/);
      if (rgb) {
        const hex = rgbToHexColor(
          [...rgb[0].matchAll(/\d+/g)].map((v) => parseInt(v[0]))
        );
        setColorHex(hex);
      }
    }
  }, [elementSelection.selectedElement]);

  return (
    <>
      <Section>
        <Checkbox
          checked={enabled}
          defaultChecked={false}
          onChange={(e) => onCheckboxChange(e.target.checked)}
        >
          影を適用する
        </Checkbox>
      </Section>
      <Section>
        <Flex>
          <IconArrowsMoveHorizontal strokeWidth={1.5} width={14} height={14} />
          <SliderWithInput
            min={-100}
            max={100}
            defaultValue={0}
            value={horizontalPosition}
            onChange={onHorizontalPositionChange}
          />
        </Flex>
      </Section>
      <Section>
        <Flex>
          <IconArrowsMoveVertical strokeWidth={1.5} width={14} height={14} />
          <SliderWithInput
            min={-100}
            max={100}
            defaultValue={0}
            value={verticalPosition}
            onChange={onVerticalPositionChange}
          />
        </Flex>
      </Section>
      <Section>
        <Flex>
          <IconBlur strokeWidth={1.5} width={14} height={14} />
          <SliderWithInput
            min={0}
            max={100}
            defaultValue={10}
            value={blur}
            onChange={onBlurChange}
          />
        </Flex>
      </Section>
      <Section>
        <Flex>
          <IconArrowsMaximize strokeWidth={1.5} width={14} height={14} />
          <SliderWithInput
            min={-100}
            max={100}
            defaultValue={3}
            value={expansion}
            onChange={onExpansionChange}
          />
        </Flex>
      </Section>
      <Flex>
        <BgColorsOutlined />
        <ColorPicker
          format={formatHex}
          value={colorHex}
          onChange={onColorChange}
          onFormatChange={setFormatHex}
          defaultValue={'#333333'}
        />
        <span>{hexString}</span>
      </Flex>
    </>
  );
};

export default BoxShadowCustomizer;
