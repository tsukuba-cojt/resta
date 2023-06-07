import React, {useEffect, useState} from "react";
import {kebabToCamel} from "../../utils/CSSUtils";
import useHoveredAndSelectedElement from "../../hooks/useHoveredAndSelectedElement";
import { Radio } from "antd";
import {RadioChangeEvent} from "antd/es/radio/interface";

interface RadioGroupProps {
  cssKey: string;
  id: number;
  values: { [key: string]: React.JSX.Element };
  onChange: (key: string, value: string, id: number) => void;
}

const RadioGroup = ({cssKey, id, values, onChange}: RadioGroupProps) => {
  const options = Object.entries(values).map((value) => ({value: value[0], label: value[1]}));
  const [value, setValue] = useState<string>("");
  const [_, selectedElement] = useHoveredAndSelectedElement();

  // @ts-ignore
  const onRadioChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    onChange(cssKey, e.target.value, id);
  }

  useEffect(() => {
    if (selectedElement) {
      const style = getComputedStyle(selectedElement);
      const value = (style as any)[kebabToCamel(cssKey)] as string;
      setValue(value);
    }
  }, [selectedElement]);

  return <Radio.Group options={options} onChange={onRadioChange} value={value} optionType="button"/>;
};

export default RadioGroup;