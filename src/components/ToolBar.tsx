import styled from 'styled-components';
import { Button } from 'antd';
import {
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import {
  closeContainer,
  toggleContainerPosition,
} from '../features/root_manager';
import { reDo, unDo } from '../features/unredo';
import { resetFormatsAry } from '../features/prop';
import {saveFormat} from "../features/format_manager";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
      <Button
        type="ghost"
        size={'small'}
        icon={<RollbackOutlined />}
        onClick={unDo}
      />
      <Button
        style={{ transform: 'scale(-1,1)' }}
        type="ghost"
        size={'small'}
        icon={<RollbackOutlined />}
        onClick={reDo}
      />
      <Button
        type="link"
        style={{ padding: '4px 0' }}
        onClick={() => {
          resetFormatsAry();
          saveFormat();
          window.location.reload();
        }}
      >
        Clear
      </Button>
    </Wrapper>
  );
};

export default ToolBar;