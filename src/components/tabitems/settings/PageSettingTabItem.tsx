import styled from 'styled-components';
import t from '../../../features/translator';
import Title from 'antd/lib/typography/Title';
import React, { ChangeEvent, useContext, useState } from 'react';
import { Button, Checkbox, Input, Popconfirm } from 'antd';
import * as prop from '../../../features/prop';
import { saveFormatImmediately } from '../../../features/format_manager';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import { getAbsoluteCSSSelector } from '../../../utils/CSSUtils';
import Section from '../common/Section';
import SubTitle from '../common/SubTitle';

const Wrapper = styled.div``;

const Description = styled.p`
  font-size: 10pt;
  padding-bottom: 8px;
`;

const DeveloperTools = styled.div`
  width: 100%;
`;

const { TextArea } = Input;

const PageSettingTabItem = () => {
  const onClickInitPageFormat = () => {
    prop.removeCurrentFormat();
    saveFormatImmediately();
    window.location.reload();
  };

  const onClickInitAllPageFormat = () => {
    prop.removeAllFormats();
    saveFormatImmediately();
    window.location.reload();
  };

  const elementSelection = useContext(ElementSelectionContext);
  const [developerToolEnabled, setDeveloperToolEnabled] =
    useState<boolean>(false);

  return (
    <Wrapper>
      <Title level={5} style={{ margin: '0 0 8px' }}>
        {t('page_settings')}
      </Title>
      <Section>
        <SubTitle text={t('init_page_format')} />
        <Description>{t('init_page_format_description')}</Description>
        <Popconfirm
          title={t('confirm')}
          description={t('confirm_description')}
          onConfirm={onClickInitPageFormat}
          okText={t('yes')}
          cancelText={t('no')}
          zIndex={999999}
        >
          <Button danger block type="primary">
            {t('execute')}
          </Button>
        </Popconfirm>
      </Section>

      <Section>
        <SubTitle text={t('change_eddited_url')} />
        <Description>{t('change_eddited_url_description')}</Description>
        <TextArea
          onChange={(value: ChangeEvent<HTMLTextAreaElement>) => {
            prop.setEdittedUrl(value.currentTarget.value);
          }}
          defaultValue={prop.currentUrl}
          autoSize={{ minRows: 1 }}
        />
      </Section>

      <Title level={5} style={{ margin: '16px 0 8px' }}>
        {t('extension_settings')}
      </Title>
      <Section>
        <SubTitle text={t('init_all_format')} />
        <Description>{t('init_all_format_description')}</Description>
        <Popconfirm
          title={t('confirm')}
          description={t('confirm_description')}
          onConfirm={onClickInitAllPageFormat}
          okText={t('yes')}
          cancelText={t('no')}
          zIndex={999999}
        >
          <Button danger block type="primary">
            {t('execute')}
          </Button>
        </Popconfirm>
      </Section>

      <Title level={5} style={{ margin: '16px 0 8px' }}>
        {t('developer_tools')}
      </Title>

      <Section>
        <Checkbox onChange={(e) => setDeveloperToolEnabled(e.target.checked)}>
          {t('show_developer_tools')}
        </Checkbox>
      </Section>

      {developerToolEnabled && (
        <DeveloperTools>
          <Section>
            <SubTitle text={t('get_css_selector')} />
            <Description>{t('get_css_selector_description')}</Description>
            <p>
              {elementSelection.selectedElement
                ? getAbsoluteCSSSelector(elementSelection.selectedElement)
                : ''}
            </p>
          </Section>
        </DeveloperTools>
      )}
    </Wrapper>
  );
};

export default PageSettingTabItem;
