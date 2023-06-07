import {Button} from "antd";
import React, {useEffect, useState} from "react";
import {kebabToCamel} from "../../utils/CSSUtils";
import useHoveredAndSelectedElement from "../../hooks/useHoveredAndSelectedElement";


interface IconButtonProps {
  icon: React.JSX.Element;
  cssKey: string;
  actualValue: string;
  defaultValue: string;
  id: number;
  onChange: (key: string, value: string, id: number) => void;
}

const IconButton = ({icon, cssKey, id, actualValue, defaultValue, onChange}: IconButtonProps) => {
  const [value, setValue] = useState<string>(defaultValue);
  const [_, selectedElement] = useHoveredAndSelectedElement();

  const onClick = () => {
    const newValue = isOn() ? defaultValue : actualValue;
    setValue(newValue);
    onChange(cssKey, newValue, id);
  }

  const isOn = () => {
    return value.includes(actualValue);
  }

  useEffect(() => {
    if (selectedElement) {
      const style = getComputedStyle(selectedElement);
      const value = (style as any)[kebabToCamel(cssKey)] as string;
      setValue(value);
      console.log(cssKey, value)
    }
  }, [selectedElement]);

  return <Button type={isOn() ? "primary" : "ghost"} icon={icon} onClick={onClick} />;
};

export default IconButton;