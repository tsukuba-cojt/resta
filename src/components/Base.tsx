import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { ChangeStyleCategoryMap } from '../types/ChangeStyleElement';
import {
  TranslatorContext,
  useTranslator,
} from '../contexts/TranslatorContext';
import ChangeStyleTabItem from './tabitems/ChangeStyleTabItem';
import ToolBar from './ToolBar';
import {
  IconCategory2,
  IconCode,
  IconLayoutGrid,
  IconSettings,
  IconTypography,
} from '@tabler/icons-react';
import FontCustomizer from './tabitems/font/FontCustomizer';
import PageSettingTabItem from './tabitems/settings/PageSettingTabItem';
import BlockCustomizer from './tabitems/block/BlockCustomizer';
import {
  ElementSelectionContext,
  useElementSelectionContext,
} from '../contexts/ElementSelectionContext';
import ElementSelector from '../features/ElementSelector';
import { setFormatAndPushToAry } from '../features/formatter';
import { getAbsoluteCSSSelector } from '../utils/CSSUtils';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px 16px 16px;
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
  overflow-y: hidden;
`;

const TabInnerWrapper = styled.div`
  transform: translateY(0);
`;

const TabIconWrapper = styled.div`
  margin: 0 12px;
  display: flex;
`;

interface BaseProps {
  categoryMap: ChangeStyleCategoryMap;
}

const Base = ({ categoryMap }: BaseProps) => {
  const translator = useTranslator();
  const elementSelection = useElementSelectionContext();
  const tabInnerWrapperRef = useRef<HTMLDivElement>(null);

  const onChange = (key: string, value: string, id: number) => {
    if (elementSelection.selectedElement) {
      setFormatAndPushToAry(
        getAbsoluteCSSSelector(elementSelection.selectedElement) +
          elementSelection.selectedPseudoClass,
        key,
        value,
        id
      );
    }
  };

  const tabs = {
    templates: <ChangeStyleTabItem categoryMap={categoryMap} />,
    fonts: <FontCustomizer onChange={onChange} />,
    blocks: <BlockCustomizer onChange={onChange} />,
    settings: <PageSettingTabItem />,
  };

  const tabIcons: { [key: string]: React.JSX.Element } = {
    templates: <IconCategory2 size={16} strokeWidth={1.5} />,
    fonts: <IconTypography size={16} strokeWidth={1.5} />,
    blocks: <IconLayoutGrid size={16} strokeWidth={1.5} />,
    pro: <IconCode size={16} strokeWidth={1.5} />,
    settings: <IconSettings size={16} strokeWidth={1.5} />,
  };

  const items = Object.entries(tabs).map(([key, component], i) => {
    return {
      label: <TabIconWrapper>{tabIcons[key]!}</TabIconWrapper>,
      key: i.toString(),
      children: component,
    };
  });

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const ref = event.currentTarget as HTMLDivElement;
    const currentValue = parseInt(
      (ref.style.transform ? ref.style.transform : '0').match(/-?\d+/)![0]
    );
    const newValue = Math.max(
      currentValue - event.deltaY >= 0 ? 0 : currentValue - event.deltaY,
      ref.parentElement!.getBoundingClientRect().height -
        ref.getBoundingClientRect().height
    );
    ref.style.transform = `translateY(${newValue}px)`;
  };

  useLayoutEffect(() => {
    tabInnerWrapperRef.current!.addEventListener('wheel', onWheel, {
      passive: false,
    });
  }, []);

  return (
    <Wrapper>
      <TranslatorContext.Provider value={translator}>
        <ElementSelectionContext.Provider value={elementSelection}>
          <ToolBar />
          <TabWrapper>
            <TabInnerWrapper ref={tabInnerWrapperRef}>
              <Tabs items={items} tabBarGutter={0} />
            </TabInnerWrapper>
          </TabWrapper>
          <ElementSelector />
        </ElementSelectionContext.Provider>
      </TranslatorContext.Provider>
    </Wrapper>
  );
};

export default Base;
