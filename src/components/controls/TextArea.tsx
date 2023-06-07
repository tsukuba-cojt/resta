import {Input} from "antd";
import React, {useEffect, useState} from "react";
import useHoveredAndSelectedElement from "../../hooks/useHoveredAndSelectedElement";
import {kebabToCamel} from "../../utils/CSSUtils";

interface TextAreaProps {
  cssKey: string;
  id: number;
  placeHolder?: string;
  onChange: (key: string, value: string, id: number) => void;
}
const TextArea = ({cssKey, id, placeHolder, onChange}: TextAreaProps) => {
  const [value, setValue] = useState<string>("");
  const { TextArea } = Input;
  const [_, selectedElement] = useHoveredAndSelectedElement();

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
    onChange(cssKey, e.currentTarget.value, id);
  }

  useEffect(() => {
    if (selectedElement) {
      const style = getComputedStyle(selectedElement);
      const defaultValue = (style as any)[kebabToCamel(cssKey)] as string;
      setValue(defaultValue);
    }
  }, [selectedElement]);

  return (
    <TextArea value={value} autoSize={{ minRows: 1, maxRows: 5 }} placeholder={placeHolder} onChange={onTextChange} />
  );
}

export default TextArea;