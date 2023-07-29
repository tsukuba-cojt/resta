import {Button} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {kebabToCamel} from "../../utils/CSSUtils";
import {ElementSelectionContext} from "../../contexts/ElementSelectionContext";


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
  const elementSelection = useContext(ElementSelectionContext);

  const onClick = () => {
    const newValue = isOn() ? defaultValue : actualValue;
    setValue(newValue);
    onChange(cssKey, newValue, id);
  }

  const isOn = () => {
    return value.includes(actualValue);
  }

  useEffect(() => {
    if (elementSelection.selectedElement) {
      const style = getComputedStyle(elementSelection.selectedElement);
      const value = (style as any)[kebabToCamel(cssKey)] as string;
      setValue(value);
    }
  }, [elementSelection.selectedElement]);

  return <Button type={isOn() ? "primary" : "ghost"} icon={icon} onClick={onClick} />;
};

export default IconButton;