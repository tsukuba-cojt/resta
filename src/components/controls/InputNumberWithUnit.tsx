import { InputNumber, Select } from 'antd';
import React, {useEffect, useState} from 'react';
import useHoveredAndSelectedElement from "../../hooks/useHoveredAndSelectedElement";
import {kebabToCamel} from "../../utils/CSSUtils";

interface InputNumberWithUnitProps {
  cssKey: string;
  id: number;
  options: string[];
  onChange: (key: string, value: string, id: number) => void;
}

const InputNumberWithUnit = ({
  cssKey,
  id,
  options,
  onChange,
}: InputNumberWithUnitProps) => {
  const [numberValue, setNumberValue] = useState<number>(0);
  const [optionValue, setOptionValue] = useState<string>(options[0]);
  const [_, selectedElement] = useHoveredAndSelectedElement();
  //const [defaultNumberValue, setDefaultNumberValue] = useState<number>(0);
  //const [defaultOptionValue, setDefaultOptionValue] = useState<string>("");

  useEffect(() => {
    if (selectedElement) {
      const style = getComputedStyle(selectedElement);
      const value = (style as any)[kebabToCamel(cssKey)] as string;
      setNumberValue(parseFloat(value.match(/^\d*.?\d+/)![0] ?? "0"));
      setOptionValue(value.match(/[a-z]+$/)![0] ?? "");
    }
  }, [selectedElement]);

  return (
    <InputNumber
      value={numberValue}
      addonAfter={
        <Select
          defaultValue={options[0]}
          value={optionValue}
          onChange={(value) => {
            onChange(cssKey, `${numberValue}${value}`, id);
            setOptionValue(value);
          }}
          options={options.map((v) => ({ value: v, label: v }))}
          dropdownStyle={{ zIndex: 99999 }}
        />
      }
      onChange={(value) => {
        onChange(cssKey, `${value}${optionValue}`, id);
        setNumberValue(value as number);
      }}
    />
  );
};

export default InputNumberWithUnit;
