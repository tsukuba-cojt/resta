import styled from 'styled-components';
import { Button, Select } from 'antd';
import {
  CloseOutlined,
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import {
  closeContainer,
  toggleContainerPosition,
} from '../features/root_manager';
import { reDo, unDo } from '../features/unredo';
import { pseudoClassOptions } from '../consts/menu';

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
  const getIcon = () => (isRight ? <LeftOutlined /> : <RightOutlined />);

  const onCloseButtonClick = () => {
    closeContainer();
  };

  return (
    <Wrapper>
      <Button
        type="ghost"
        size={'small'}
        icon={<CloseOutlined />}
        onClick={onCloseButtonClick}
      />
      <Button
        type="ghost"
        size={'small'}
        icon={getIcon()}
        onClick={() => setRight(toggleContainerPosition)}
      />
      <ToolBarSpace />
      <Select
        size={'small'}
        bordered={false}
        options={pseudoClassOptions}
        defaultValue={pseudoClassOptions[0]}
        popupMatchSelectWidth={false}
        dropdownStyle={{ zIndex: 99999 }}
        placement={'bottomRight'}
      />
      <Button
        type="ghost"
        size={'small'}
        icon={<UndoOutlined />}
        onClick={unDo}
      />
      <Button
        type="ghost"
        size={'small'}
        icon={<RedoOutlined />}
        onClick={reDo}
      />
    </Wrapper>
  );
};

export default ToolBar;
