import styled from 'styled-components';
import t from '../../../features/translator';
import React, { ChangeEvent, useContext, useState } from 'react';
import { Button, Checkbox, Input, Modal, Popconfirm, Progress } from 'antd';
import { save } from '../../../features/format_manager';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import { getAbsoluteCSSSelector } from '../../../utils/CSSUtils';
import Section from '../common/Section';
import SubTitle from '../common/SubTitle';
import { DEBUG_MODE } from '../../../consts/debug';
import { PropsContext } from '../../../contexts/PropsContext';

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
  const prop = useContext(PropsContext);
  const onClickInitPageFormats = async () => {
    // editedUrlと一致するものを削除
    const newAry = prop.formatsArray.filter((f) => f.url !== prop.editedUrl);
    await save(newAry);
    window.location.reload();
  };

  const onClickInitAllPagesFormats = async () => {
    // localStorageのformatsを上書き
    await save([]);
    // ページをリロード
    window.location.reload();
  };

  const elementSelection = useContext(ElementSelectionContext);
  const [developerToolEnabled, setDeveloperToolEnabled] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [storage, setStorage] = useState<string>('');

  return (
    <Wrapper>
      <Section>
        <SubTitle text={t('init_page_format')} />
        <Description>{t('init_page_format_description')}</Description>
        <Popconfirm
          title={t('confirm')}
          description={t('confirm_description')}
          onConfirm={onClickInitPageFormats}
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
            prop.setEditedUrl(value.currentTarget.value);
          }}
          defaultValue={prop.currentUrl}
          autoSize={{ minRows: 1 }}
        />
      </Section>

      <Section>
        <SubTitle text={t('init_all_format')} />
        <Description>{t('init_all_format_description')}</Description>
        <Popconfirm
          title={t('confirm')}
          description={t('confirm_description')}
          onConfirm={onClickInitAllPagesFormats}
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

          {DEBUG_MODE && (
            <Section>
              <SubTitle text={'ストレージ内容を表示'} />
              <Description>{'拡張機能のストレージ内容を表示'}</Description>
              <Button
                block
                type="primary"
                onClick={async () => {
                  setStorage(
                    JSON.stringify(
                      await chrome.storage.local.get([
                        'formats',
                        'imported_style',
                      ]),
                      null,
                      '  ',
                    ),
                  );
                  setIsModalOpen(true);
                }}
              >
                開く
              </Button>
              <Modal
                title="ストレージ内容"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                zIndex={99999}
              >
                <p style={{ textAlign: 'left' }}>
                  合計サイズ：{new Blob([storage]).size / 1000000.0}MB（
                  {new Blob([storage]).size / 1000.0}KB）/ 5MB
                </p>
                <Progress
                  percent={(new Blob([storage]).size / 5000000.0) * 100}
                  showInfo={false}
                />
                <TextArea
                  defaultValue={storage}
                  contentEditable={false}
                  autoSize={{ minRows: 5, maxRows: 20 }}
                />
              </Modal>
            </Section>
          )}
        </DeveloperTools>
      )}
    </Wrapper>
  );
};

export default PageSettingTabItem;
