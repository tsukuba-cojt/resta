import { InputNumber, Select } from 'antd';
import React, { useState } from 'react';
import { ChangeStyleElement } from '../../types/ChangeStyleElement';

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

  return (
    <InputNumber
      addonAfter={
        <Select
          defaultValue={
            (element.parts[1].defaultValue as string) ??
            element.parts[1].options![0]
          }
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
