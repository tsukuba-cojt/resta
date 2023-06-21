import styled from 'styled-components';
import t from '../../../features/translator';
import Title from 'antd/lib/typography/Title';
import React, { useContext } from 'react';
import { Button, Collapse, Input, Popconfirm } from 'antd';
import * as prop from '../../../features/prop';
import { saveFormat } from '../../../features/format_manager';
import { removeAllFormats } from '../../../features/prop';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import { getAbsoluteCSSSelector } from '../../../utils/CSSUtils';

const Wrapper = styled.div``;

const CollapseWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
`;

const Description = styled.p`
  font-size: 10pt;
  padding-bottom: 12px;
`;

const PageSettingTabItem = () => {
  const { Panel } = Collapse;

  const onClickInitPageFormat = () => {
    prop.removeCurrentFormat();
    saveFormat();
    window.location.reload();
  };

  const onClickInitAllPageFormat = () => {
    removeAllFormats();
    saveFormat();
    window.location.reload();
  };

  const elementSelection = useContext(ElementSelectionContext);

  let index = 0;

  return (
    <Wrapper>
      <Title level={5} style={{ margin: '0 0 8px' }}>
        {t('page_settings')}
      </Title>
      <CollapseWrapper>
        <Collapse size="small">
          <Panel header={t('init_page_format')} key={index++}>
            <Description>{t('init_page_format_description')}</Description>
            <Popconfirm
              title={t('confirm')}
              description={t('confirm_description')}
              onConfirm={onClickInitPageFormat}
              okText={t('yes')}
              cancelText={t('no')}
              zIndex={999999}
            >
              <Button danger>{t('execute')}</Button>
            </Popconfirm>
          </Panel>
          <Panel header={t('change_eddited_url')} key={index++}>
            <Description>{t('change_eddited_url_description')}</Description>
            <Input
              onChange={(value) => {
                prop.setEdittedUrl(value.currentTarget.value);
              }}
              defaultValue={prop.currentUrl}
            />
          </Panel>
        </Collapse>
      </CollapseWrapper>

      <Title level={5} style={{ margin: '16px 0 8px' }}>
        {t('extension_settings')}
      </Title>
      <CollapseWrapper>
        <Collapse size="small">
          <Panel header={t('init_all_format')} key={index++}>
            <Description>{t('init_all_format_description')}</Description>
            <Popconfirm
              title={t('confirm')}
              description={t('confirm_description')}
              onConfirm={onClickInitAllPageFormat}
              okText={t('yes')}
              cancelText={t('no')}
              zIndex={999999}
            >
              <Button danger>{t('execute')}</Button>
            </Popconfirm>
          </Panel>
        </Collapse>
      </CollapseWrapper>

      <Title level={5} style={{ margin: '16px 0 8px' }}>
        {t('developer_tools')}
      </Title>
      <CollapseWrapper>
        <Collapse size="small">
          <Panel header={t('get_css_selector')} key={index++}>
            <Description>{t('get_css_selector_description')}</Description>
            <p>
              {elementSelection.selectedElement
                ? getAbsoluteCSSSelector(elementSelection.selectedElement)
                : ''}
            </p>
          </Panel>
        </Collapse>
      </CollapseWrapper>
    </Wrapper>
  );
};

export default PageSettingTabItem;
