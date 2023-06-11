import styled from 'styled-components';
import t from '../../features/translator';
import Title from 'antd/lib/typography/Title';
import React, { useContext, useEffect } from 'react';
import { TranslatorContext } from '../../contexts/TranslatorContext';
import { downloadLangJson } from '../../features/setting_downloader';
import { Button, Collapse, Input, Popconfirm } from 'antd';
import * as prop from '../../features/prop';
import { saveFormat } from '../../features/format_manager';
import { removeAllFormats } from '../../features/prop';

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
  const translator = useContext(TranslatorContext);
  const { Panel } = Collapse;

  useEffect(() => {
    (async () => {
      translator.setLanguage(await downloadLangJson());
    })();
  }, []);
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

  let index = 0;

  return (
    <Wrapper>
      <Title level={5} style={{ margin: '0 0 8px' }}>
        {t(translator.lang, 'page_settings')}
      </Title>
      <CollapseWrapper>
        <Collapse size="small">
          <Panel header={t(translator.lang, 'init_page_format')} key={index++}>
            <Description>
              {t(translator.lang, 'init_page_format_description')}
            </Description>
            <Popconfirm
              title={t(translator.lang, 'confirm')}
              description={t(translator.lang, 'confirm_description')}
              onConfirm={onClickInitPageFormat}
              okText={t(translator.lang, 'yes')}
              cancelText={t(translator.lang, 'no')}
              zIndex={999999}
            >
              <Button danger>{t(translator.lang, 'execute')}</Button>
            </Popconfirm>
          </Panel>
          <Panel
            header={t(translator.lang, 'change_eddited_url')}
            key={index++}
          >
            <Description>
              {t(translator.lang, 'change_eddited_url_description')}
            </Description>
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
        {t(translator.lang, 'extension_settings')}
      </Title>
      <CollapseWrapper>
        <Collapse size="small">
          <Panel header={t(translator.lang, 'init_all_format')} key={index++}>
            <Description>
              {t(translator.lang, 'init_all_format_description')}
            </Description>
            <Popconfirm
              title={t(translator.lang, 'confirm')}
              description={t(translator.lang, 'confirm_description')}
              onConfirm={onClickInitAllPageFormat}
              okText={t(translator.lang, 'yes')}
              cancelText={t(translator.lang, 'no')}
              zIndex={999999}
            >
              <Button danger>{t(translator.lang, 'execute')}</Button>
            </Popconfirm>
          </Panel>
        </Collapse>
      </CollapseWrapper>
    </Wrapper>
  );
};

export default PageSettingTabItem;
