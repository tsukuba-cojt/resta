import { InputNumber, Select } from 'antd';
import React, {useEffect, useState} from 'react';
import { ChangeStyleElement } from '../../types/ChangeStyleElement';
import useHoveredAndSelectedElement from "../../hooks/useHoveredAndSelectedElement";
import {kebabToCamel} from "../../utils/CSSUtils";

interface InputNumberWithUnitProps {
  element: ChangeStyleElement;
  onChange: (key: string, value: string, id: number) => void;
}

const InputNumberWithUnit = ({
  element,
  onChange,
}: InputNumberWithUnitProps) => {
  const [numberValue, setNumberValue] = useState<number>(0);
  const [optionValue, setOptionValue] = useState<string>(
    (element.parts[1].defaultValue as string) ?? element.parts[1].options![0]
  );
  const [_, selectedElement] = useHoveredAndSelectedElement();
  //const [defaultNumberValue, setDefaultNumberValue] = useState<number>(0);
  //const [defaultOptionValue, setDefaultOptionValue] = useState<string>("");

  useEffect(() => {
    if (selectedElement) {
      const style = getComputedStyle(selectedElement);
      const value = (style as any)[kebabToCamel(element.key)] as string;
      console.log(value, element.key)
      setNumberValue(parseFloat(value.match(/^\d*.?\d+/)![0] ?? "0"));
      setOptionValue(value.match(/[a-z]+$/)![0] ?? "");
    }
  }, [selectedElement]);

  return (
    <InputNumber
      value={numberValue}
      addonAfter={
        <Select
          defaultValue={
            (element.parts[1].defaultValue as string) ?? element.parts[1].options![0]
          }
          value={optionValue}
          onChange={(value) => {
            onChange(element.key, `${numberValue}${value}`, element.id);
            setOptionValue(value);
          }}
          options={element.parts[1].options!.map((option) => {
            return { value: option, label: option };
          })}
          dropdownStyle={{ zIndex: 99999 }}
        />
      }
      onChange={(value) => {
        onChange(element.key, `${value}${optionValue}`, element.id);
        setNumberValue(value as number);
      }}
    />
  );
};

export default InputNumberWithUnit;
