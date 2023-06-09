import Flex from "../common/Flex";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Checkbox, Col, ColorPicker, InputNumber, Row, Slider} from "antd";
import {IconArrowsMaximize, IconArrowsMoveHorizontal, IconArrowsMoveVertical, IconBlur} from "@tabler/icons-react";
import Section from "../common/Section";
import {createId} from "../../../utils/IDUtils";
import {BgColorsOutlined} from "@ant-design/icons";
import {Color} from "antd/es/color-picker";
import {ElementSelectionContext} from "../../../contexts/ElementSelectionContext";
import {kebabToCamel} from "../../../utils/CSSUtils";
import styled from "styled-components";

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

const SliderWithInput = ({min = 0, max = 100, defaultValue, value, onChange}: SliderWithInputProps) => {
  return (
    <Row gutter={16} style={{width: "100%"}}>
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
          style={{width: "100%"}}
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
  onChange: (key: string, value: string, id: number) => void;
}

const BoxShadowCustomizer = ({onChange}: BoxShadowCustomizerProps) => {
  const elementSelection = useContext(ElementSelectionContext);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [verticalPosition, setVerticalPosition] = useState<number>(0);
  const [horizontalPosition, setHorizontalPosition] = useState<number>(0);
  const [expansion, setExpansion] = useState<number>(3);
  const [blur, setBlur] = useState<number>(10);
  const [colorHex, setColorHex] = useState<Color | string>('#727272');
  const [formatHex, setFormatHex] = useState<"rgb" | "hsb" | "hex">('hex');

  const hexString = useMemo(
    () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
    [colorHex],
  );

  useEffect(() => {
    let newValue = 'none';
    if (enabled) {
      newValue = `${horizontalPosition}px ${verticalPosition}px ${blur}px ${expansion}px ${hexString}`
    }
    onChange('box-shadow', newValue, createId());
  }, [enabled, verticalPosition, horizontalPosition, verticalPosition, expansion, blur, hexString]);

  useEffect(() => {
    if (elementSelection.selectedElement) {
      const style = getComputedStyle(elementSelection.selectedElement);
      const value = (style as any)[kebabToCamel('box-shadow')] as string;

      if (value === 'none') {
        return;
      }
    }
  }, [elementSelection.selectedElement]);

  return (
    <>
      <Section>
        <Checkbox value={enabled} onChange={(e) => setEnabled(e.target.checked)}>影を適用する</Checkbox>
      </Section>
      <Section>
        <Flex>
          <IconArrowsMoveHorizontal strokeWidth={1.5} width={14} height={14}/>
          <SliderWithInput min={-100} max={100} defaultValue={0} value={horizontalPosition} onChange={setHorizontalPosition}/>
        </Flex>
      </Section>
      <Section>
        <Flex>
          <IconArrowsMoveVertical strokeWidth={1.5} width={14} height={14}/>
          <SliderWithInput min={-100} max={100} defaultValue={0} value={verticalPosition} onChange={setVerticalPosition}/>
        </Flex>
      </Section>
      <Section>
        <Flex>
          <IconBlur strokeWidth={1.5} width={14} height={14}/>
          <SliderWithInput min={0} max={100} defaultValue={10} value={blur} onChange={setBlur}/>
        </Flex>
      </Section>
      <Section>
        <Flex>
          <IconArrowsMaximize strokeWidth={1.5} width={14} height={14}/>
          <SliderWithInput min={-100} max={100} defaultValue={3} value={expansion} onChange={setExpansion}/>
        </Flex>
      </Section>
      <Flex>
        <BgColorsOutlined/>
        <ColorPicker
          format={formatHex}
          value={colorHex}
          onChange={setColorHex}
          onFormatChange={setFormatHex}
          defaultValue={'#727272'}
        />
        <span>{hexString}</span>
      </Flex>
    </>
  );
};

export default BoxShadowCustomizer;