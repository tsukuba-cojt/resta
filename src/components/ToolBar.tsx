import styled from "styled-components";
import {Button, message} from "antd";
import {CloseOutlined, LeftOutlined, RightOutlined} from "@ant-design/icons";
import t from "../features/translator";
import React, {useContext, useState} from "react";
import {saveFormat} from "../features/formatter";
import {TranslatorContext} from "../contexts/TranslatorContext";
import {closeContainer, toggleContainerPosition} from "../features/root_manager";

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
  const translator = useContext(TranslatorContext);
  const [messageApi, contextHolder] = message.useMessage();
  const getIcon = () => isRight ? <LeftOutlined/> : <RightOutlined/>;

  const onSaveButtonClick = () => {
    messageApi.open({
      key: "save_formats",
      type: 'loading',
      content: '保存中...',
    });
    saveFormat();
    messageApi.open({
      key: "save_formats",
      type: 'success',
      content: '保存しました',
      duration: 2,
    });
  };

  const onCloseButtonClick = () => {
    closeContainer();
  }

  return (
    <Wrapper>
      {contextHolder}
      <Button type="ghost" size={"small"} icon={<CloseOutlined/>} onClick={onCloseButtonClick}/>
      <Button type="ghost" size={"small"} icon={getIcon()} onClick={() => setRight(toggleContainerPosition)}/>
      <ToolBarSpace/>
      <Button type="link" style={{padding: "4px 0"}}
              onClick={onSaveButtonClick}>{t(translator.lang, "save_button")}</Button>
    </Wrapper>
  );
}

export default ToolBar;