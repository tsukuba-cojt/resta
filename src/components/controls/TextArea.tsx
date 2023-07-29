import { Input } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { kebabToCamel } from '../../utils/CSSUtils';
import { ElementSelectionContext } from '../../contexts/ElementSelectionContext';

interface TextAreaProps {
  cssKey: string;
  id: number;
  placeHolder?: string;
  onChange: (key: string, value: string, id: number) => void;
}
const TextArea = ({ cssKey, id, placeHolder, onChange }: TextAreaProps) => {
  const [value, setValue] = useState<string>('');
  const { TextArea } = Input;
  const elementSelection = useContext(ElementSelectionContext);

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
    onChange(cssKey, e.currentTarget.value, id);
  };

  useEffect(() => {
    if (elementSelection.selectedElement) {
      const style = getComputedStyle(elementSelection.selectedElement);
      const defaultValue = (style as any)[kebabToCamel(cssKey)] as string;
      setValue(defaultValue);
    }
  }, [elementSelection.selectedElement]);

  return (
    <TextArea
      value={value}
      autoSize={{ minRows: 1, maxRows: 5 }}
      placeholder={placeHolder}
      onChange={onTextChange}
    />
  );
};

export default TextArea;
