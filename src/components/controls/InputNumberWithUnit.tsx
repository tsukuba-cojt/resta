import { Col, Input, Row, Select, Slider } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { kebabToCamel } from '../../utils/CSSUtils';
import { ElementSelectionContext } from '../../contexts/ElementSelectionContext';

interface InputNumberWithUnitProps {
  cssKey: string;
  id: number | string;
  options: string[];
  onChange: (key: string, value: string, id: number | string) => void;
  ignores?: string[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
}

const InputNumberWithUnit = ({
  cssKey,
  id,
  options,
  onChange,
  ignores = [],
  sliderMin = 0,
  sliderMax = 100,
  sliderStep = 1,
}: InputNumberWithUnitProps) => {
  const [inputValue, setInputValue] = useState<string>('0');
  const [optionValue, setOptionValue] = useState<string>(options[0]);
  const [inputStatus, setInputStatus] = useState<'error' | ''>('');
  const elementSelection = useContext(ElementSelectionContext);

  useEffect(() => {
    if (elementSelection.selectedElement) {
      const style = getComputedStyle(elementSelection.selectedElement);
      const rawValue = (style as any)[kebabToCamel(cssKey)] as string;

      const num = rawValue.match(/^\d*.?\d+/);
      setInputValue(num ? num[0] : rawValue);

      const option = rawValue.match(/[a-z]+$/);
      if (!ignores.includes(rawValue) && option) {
        setOptionValue(option[0]);
      } else {
        setOptionValue('');
      }
    }
  }, [elementSelection.selectedElement]);

  const onSliderChange = (value: number) => {
    let newOptionValue = optionValue;
    if (optionValue.length === 0) {
      setOptionValue(options[0]);
      newOptionValue = optionValue[0];
    }
    onChange(cssKey, `${value}${newOptionValue}`, id);
    setInputValue(value.toString());
  };

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value.match(/^\d*.?\d+$/)) {
      let newOptionValue = optionValue;
      if (optionValue.length === 0) {
        setOptionValue(options[0]);
        newOptionValue = optionValue[0];
      }
      onChange(cssKey, `${value}${newOptionValue}`, id);
      setInputStatus('');
    } else if (ignores.includes(value)) {
      onChange(cssKey, `${value}`, id);
      setOptionValue('');
      setInputStatus('');
    } else {
      setInputStatus('error');
    }

    setInputValue(value);
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Slider
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          onChange={onSliderChange}
          value={inputValue.match(/^\d*.?\d+$/) ? parseFloat(inputValue) : 0}
        />
      </Col>
      <Col span={12}>
        <Input
          value={inputValue}
          status={inputStatus}
          addonAfter={
            <Select
              defaultValue={options[0]}
              value={optionValue}
              onChange={(value) => {
                onChange(cssKey, `${inputValue}${value}`, id);
                setOptionValue(value);
              }}
              options={
                !ignores.includes(inputValue)
                  ? options.map((v) => ({ value: v, label: v }))
                  : []
              }
              dropdownStyle={{ zIndex: 99999, minWidth: '67px' }}
            />
          }
          onChange={onValueChange}
        />
      </Col>
    </Row>
  );
};

export default InputNumberWithUnit;
