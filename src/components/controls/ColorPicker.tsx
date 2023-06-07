import React, {useEffect, useMemo, useState} from "react";
import {ColorPicker as AntdColorPicker, Space} from 'antd';
import type {Color} from 'antd/es/color-picker';
import {kebabToCamel} from "../../utils/CSSUtils";
import useHoveredAndSelectedElement from "../../hooks/useHoveredAndSelectedElement";

interface ColorPickerProps {
  cssKey: string;
  id: number;
  onChange: (key: string, value: string, id: number) => void;
}

const ColorPicker = ({cssKey, id, onChange}: ColorPickerProps) => {
  const [colorHex, setColorHex] = useState<Color | string>('#1677ff');
  const [formatHex, setFormatHex] = useState<"rgb" | "hsb" | "hex">('hex');
  const [_, selectedElement] = useHoveredAndSelectedElement();

  const hexString = useMemo(
    () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
    [colorHex],
  );

  const onColorChange = (color: Color | string) => {
    setColorHex(color);
    onChange(cssKey, hexString, id);
  }

  useEffect(() => {
    if (selectedElement) {
      const style = getComputedStyle(selectedElement);
      const value = (style as any)[kebabToCamel(cssKey)] as string;
      setColorHex(value);
    }
  }, [selectedElement]);

  return (
    <Space>
      <AntdColorPicker
        format={formatHex}
        value={colorHex}
        onChange={onColorChange}
        onFormatChange={setFormatHex}
      />
      <span>{hexString}</span>
    </Space>
  );
};

export default ColorPicker;