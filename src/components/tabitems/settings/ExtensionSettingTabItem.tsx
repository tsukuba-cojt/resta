import styled from 'styled-components';
import t from '../../../features/translator';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import { Button, Collapse, Popconfirm } from 'antd';
import { removeAllFormats } from '../../../features/prop';
import { saveFormat } from '../../../features/format_manager';

const Wrapper = styled.div``;

const CollapseWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
`;

const Description = styled.p`
  font-size: 10pt;
  padding-bottom: 12px;
`;

const ExtensionSettingTabItem = () => {
  const { Panel } = Collapse;

  const onClickInitAllPageFormat = () => {
    removeAllFormats();
    saveFormat();
    window.location.reload();
  };
  let index = 0;

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default ExtensionSettingTabItem;
