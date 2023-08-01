import React from 'react';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { ChangeStyleCategoryMap } from '../types/ChangeStyleElement';
import ToolBar from './ToolBar';
import {
  IconCode,
  IconLayoutGrid,
  IconSettings,
  IconTypography,
  IconTemplate,
  IconLayersSubtract,
} from '@tabler/icons-react';
import FontCustomizer from './tabitems/font/FontCustomizer';
import PageSettingTabItem from './tabitems/settings/PageSettingTabItem';
import BlockCustomizer from './tabitems/block/BlockCustomizer';
import {
  ElementSelectionContext,
  useElementSelectionContext,
} from '../contexts/ElementSelectionContext';
import ElementSelector from './utils/ElementSelector';
import { setFormatsAndPushToAry } from '../features/formatter';
import { getAbsoluteCSSSelector } from '../utils/CSSUtils';
import TemplateCustomizer from './tabitems/template/TemplateCustomizer';
import Scrollable from './tabitems/common/Scrollable';
import LayerCustomizer from './tabitems/layer/LayerCustomizer';
import { UIUpdaterContext, useUIUpdater } from '../contexts/UIUpdater';

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
  overflow-x: hidden;
`;

const TabIconWrapper = styled.div`
  margin: 0 12px;
  display: flex;
`;

interface BaseProps {
  categoryMap: ChangeStyleCategoryMap;
}

const Base = ({}: /* categoryMap */ BaseProps) => {
  const elementSelection = useElementSelectionContext();
  const updater = useUIUpdater();

  const onChange = (key: string, value: string, id: number | string) => {
    if (elementSelection.selectedElement) {
      setFormatsAndPushToAry([
        {
          id,
          cssSelector:
            getAbsoluteCSSSelector(elementSelection.selectedElement) +
            elementSelection.selectedPseudoClass,
          values: [{ key, value }],
        },
      ]);
      updater.formatChanged();
    }
  };

  const tabs = {
    //templates.json: <ChangeStyleTabItem categoryMap={categoryMap} />,
    fonts: <FontCustomizer onChange={onChange} />,
    blocks: <BlockCustomizer onChange={onChange} />,
    templates: <TemplateCustomizer />,
    layers: <LayerCustomizer />,
    settings: <PageSettingTabItem />,
  };

  const tabIcons: { [key: string]: React.JSX.Element } = {
    //templates.json: <IconCategory2 size={16} strokeWidth={1.5} />,
    fonts: <IconTypography size={16} strokeWidth={1.5} />,
    blocks: <IconLayoutGrid size={16} strokeWidth={1.5} />,
    templates: <IconTemplate size={16} strokeWidth={1.5} />,
    layers: <IconLayersSubtract size={16} strokeWidth={1.5} />,
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

  return (
    <Wrapper>
      <ElementSelectionContext.Provider value={elementSelection}>
        <UIUpdaterContext.Provider value={updater}>
          <ToolBar />
          <TabWrapper>
            <Scrollable>
              <Tabs items={items} tabBarGutter={0} />
            </Scrollable>
          </TabWrapper>
          <ElementSelector />
        </UIUpdaterContext.Provider>
      </ElementSelectionContext.Provider>
    </Wrapper>
  );
};

export default Base;
