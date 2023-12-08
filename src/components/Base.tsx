import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Tabs } from 'antd';
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
import TemplateCustomizer from './tabitems/template/TemplateCustomizer';
import Scrollable from './tabitems/common/Scrollable';
import LayerCustomizer from './tabitems/layer/LayerCustomizer';
import t from '../features/translator';
import usePropsContext, { PropsContext } from '../contexts/PropsContext';
import Controller from './Controller';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px 16px 16px;
  background-color: #ffffffcc;
  box-sizing: border-box;
  cursor: default;
  display: flex;
  flex-direction: column;

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* ぼかしエフェクト */
  border-radius: 8px;
  border: none;
  box-shadow: rgb(0, 0, 0, 0.1) 0 2px 16px 0;
`;

const TabWrapper = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;
`;

const TabIconWrapper = styled.div`
  margin: 0 12px;
  display: flex;
`;

const Description = styled.p`
  font-size: 14px;
`;

interface BaseProps {
  categoryMap: ChangeStyleCategoryMap;
}

const Base = ({}: /* categoryMap */ BaseProps) => {
  const elementSelection = useElementSelectionContext();
  const props = usePropsContext();
  const [fontPermissionGranted, setFontPermissionGranted] =
    useState<boolean>(true);

  const tabs = {
    //templates.json: <ChangeStyleTabItem categoryMap={categoryMap} />,
    templates: <TemplateCustomizer />,
    fonts: <FontCustomizer />,
    blocks: <BlockCustomizer />,
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

  const checkFontPermission = async () => {
    try {
      // @ts-ignore
      await window.queryLocalFonts();
      setFontPermissionGranted(true);
    } catch {
      setFontPermissionGranted(false);
    }
  };

  useEffect(() => {
    (async () => {
      await checkFontPermission();
    })();
  }, []);

  return (
    <Wrapper>
      <PropsContext.Provider value={props}>
        <ElementSelectionContext.Provider value={elementSelection}>
          <Controller />
          <ToolBar />
          {fontPermissionGranted && (
            <TabWrapper>
              <Scrollable>
                <Tabs items={items} tabBarGutter={0} />
              </Scrollable>
            </TabWrapper>
          )}
          {!fontPermissionGranted && (
            <>
              <Description>
                {t('need_to_grant_for_access_local_font')}
              </Description>
              <Button block type={'primary'} onClick={checkFontPermission}>
                {t('grant_for_access')}
              </Button>
            </>
          )}
          <ElementSelector />
        </ElementSelectionContext.Provider>
      </PropsContext.Provider>
    </Wrapper>
  );
};

export default Base;
