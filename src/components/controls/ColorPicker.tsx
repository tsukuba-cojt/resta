import React, {useContext, useEffect, useMemo, useState} from "react";
import {ColorPicker as AntdColorPicker, Space} from 'antd';
import type {Color} from 'antd/es/color-picker';
import {kebabToCamel} from "../../utils/CSSUtils";
import {ElementSelectionContext} from "../../contexts/ElementSelectionContext";

interface ColorPickerProps {
  cssKey: string;
  id: number;
  onChange: (key: string, value: string, id: number) => void;
}

const ColorPicker = ({cssKey, id, onChange}: ColorPickerProps) => {
  const [colorHex, setColorHex] = useState<Color | string>('#1677ff');
  const [formatHex, setFormatHex] = useState<"rgb" | "hsb" | "hex">('hex');
  const elementSelection = useContext(ElementSelectionContext);

  const hexString = useMemo(
    () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
    [colorHex],
  );

  useEffect(() => {
    onChange(cssKey, hexString, id);
  }, [hexString]);

  useEffect(() => {
    if (elementSelection.selectedElement) {
      const style = getComputedStyle(elementSelection.selectedElement);
      const value = (style as any)[kebabToCamel(cssKey)] as string;
      setColorHex(value);
    }
  }, [elementSelection.selectedElement]);

  return (
    <Space>
      <AntdColorPicker
        format={formatHex}
        value={colorHex}
        onChange={setColorHex}
        onFormatChange={setFormatHex}
      />
      <span>{hexString}</span>
    </Space>
  );
};

export default ColorPicker;