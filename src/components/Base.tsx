import React from 'react';
import styled from 'styled-components';
import {Tabs} from 'antd';
import {ChangeStyleCategoryMap} from '../types/ChangeStyleElement';
import {
  TranslatorContext,
  useTranslator,
} from '../contexts/TranslatorContext';
import ChangeStyleTabItem from "./tabitems/ChangeStyleTabItem";
import ToolBar from "./ToolBar";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 16px 16px;
  background-color: #f0f0f099;
  box-sizing: border-box;
  cursor: default;
  display: flex;
  flex-direction: column;

  border-radius: 8px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* ぼかしエフェクト */
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-right-color: rgba(255, 255, 255, 0.2);
  border-bottom-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 16px 0 #f0f0f0;
`;


const TabWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
`;

interface BaseProps {
  categoryMap: ChangeStyleCategoryMap;
}

const Base = ({categoryMap}: BaseProps) => {
  const translator = useTranslator();

  const tabs = {
    'スタイルの変更': <ChangeStyleTabItem categoryMap={categoryMap}/>,
    'ページ設定': `a`,
    '拡張機能設定': `x`,
  };

  const items = Object.entries(tabs).map(([key, component], i) => {
    return {
      label: key,
      key: i.toString(),
      children: component,
    };
  });

  return (
    <Wrapper>
      <TranslatorContext.Provider value={translator}>
        <ToolBar />
        <TabWrapper>
          <Tabs items={items}/>
        </TabWrapper>
      </TranslatorContext.Provider>
    </Wrapper>
  );
};

export default Base;
