import styled from 'styled-components';
import { Button, Select } from 'antd';
import {
  CloseOutlined,
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import {
  closeContainer,
  toggleContainerPosition,
} from '../features/root_manager';
import { pseudoClassOptions, selectElementByOptions } from '../consts/menu';
import { ElementSelectionContext } from '../contexts/ElementSelectionContext';
import { PropsContext } from '../contexts/PropsContext';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ToolBarSpace = styled.div`
  width: 100%;
  height: 1px;
`;

const ToolBar = () => {
  const [isRight, setRight] = useState<boolean>(true);
  const elementSelection = useContext(ElementSelectionContext);
  const getIcon = () => (isRight ? <LeftOutlined /> : <RightOutlined />);
  const context = useContext(PropsContext);

  const onCloseButtonClick = () => {
    elementSelection.setSelectedElement(null);
    elementSelection.setHoveredElement(null);
    elementSelection.setOverlayElements([]);

    Array.from(document.querySelectorAll(".resta-selected-element")).forEach((element) => element.remove());

    closeContainer();
  };

  useEffect(
    () => elementSelection.setSelectedPseudoClass(''),
    [elementSelection.selectedElement],
  );

  return (
    <Wrapper>
      <Button
        type="text"
        size={'small'}
        icon={<CloseOutlined />}
        onClick={onCloseButtonClick}
      />
      <Button
        type="text"
        size={'small'}
        icon={getIcon()}
        onClick={() => setRight(toggleContainerPosition)}
      />
      <ToolBarSpace />
      <Select
        size={'small'}
        bordered={false}
        options={selectElementByOptions}
        defaultValue={selectElementByOptions[0].value}
        popupMatchSelectWidth={false}
        dropdownStyle={{ zIndex: 99999 }}
        placement={'bottomRight'}
        value={elementSelection.selectElementBy}
        onChange={elementSelection.setSelectElementBy}
      />
      <Select
        size={'small'}
        bordered={false}
        options={pseudoClassOptions}
        defaultValue={pseudoClassOptions[0].value}
        popupMatchSelectWidth={false}
        dropdownStyle={{ zIndex: 99999 }}
        placement={'bottomRight'}
        value={elementSelection.selectedPseudoClass}
        onChange={elementSelection.setSelectedPseudoClass}
      />
      <Button
        type="text"
        size={'small'}
        disabled={!context.executor.isUndoable}
        icon={
          <UndoOutlined
            style={{
              color: context.executor.isUndoable ? 'black' : 'lightgray',
            }}
          />
        }
        onClick={context.executor.undo}
      />
      <Button
        type="text"
        size={'small'}
        disabled={!context.executor.isRedoable}
        icon={
          <RedoOutlined
            style={{
              color: context.executor.isRedoable ? 'black' : 'lightgray',
            }}
          />
        }
        onClick={context.executor.redo}
      />
    </Wrapper>
  );
};

export default ToolBar;
