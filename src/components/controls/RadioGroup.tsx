import React, { useContext, useEffect, useState } from 'react';
import { kebabToCamel } from '../../utils/CSSUtils';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import { ElementSelectionContext } from '../../contexts/ElementSelectionContext';

interface RadioGroupProps {
  cssKey: string;
  id: number | string;
  values: { [key: string]: React.JSX.Element };
  onChange: (key: string, value: string, id: number | string) => void;
}

const RadioGroup = ({ cssKey, id, values, onChange }: RadioGroupProps) => {
  const options = Object.entries(values).map((value) => ({
    value: value[0],
    label: value[1],
  }));
  const [value, setValue] = useState<string>('');
  const elementSelection = useContext(ElementSelectionContext);

  // @ts-ignore
  const onRadioChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    onChange(cssKey, e.target.value, id);
  };

  useEffect(() => {
    if (elementSelection.selectedElement) {
      const style = getComputedStyle(elementSelection.selectedElement);
      const value = (style as any)[kebabToCamel(cssKey)] as string;
      setValue(value);
    }
  }, [elementSelection.selectedElement]);

  return (
    <Radio.Group
      options={options}
      onChange={onRadioChange}
      value={value}
      optionType="button"
    />
  );
};

export default RadioGroup;
