import { Select as AntdSelect } from 'antd';
import React from 'react';

interface SelectProps {
  cssKey: string;
  options: { [key: string]: string };
  id: number;
  onChange: (key: string, value: string, id: number) => void;
}

const Select = ({ cssKey, options, id, onChange }: SelectProps) => {
  return (
    <AntdSelect
      defaultValue={Object.values(options)[0]}
      onChange={(value) => onChange(cssKey, value, id)}
      options={Object.entries(options).map((option) => {
        return { value: option[1], label: option[0] };
      })}
      dropdownStyle={{ zIndex: 99999 }}
    />
  );
};

export default Select;
