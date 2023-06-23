import styled from 'styled-components';
import t from '../../../features/translator';
import Title from 'antd/lib/typography/Title';
import React, {ChangeEvent, useContext, useState} from 'react';
import {Button, Checkbox, Input, Modal, Popconfirm, Progress} from 'antd';
import * as prop from '../../../features/prop';
import {saveFormat} from '../../../features/format_manager';
import {removeAllFormats} from '../../../features/prop';
import {ElementSelectionContext} from '../../../contexts/ElementSelectionContext';
import {getAbsoluteCSSSelector} from '../../../utils/CSSUtils';
import Section from "../common/Section";
import SubTitle from "../common/SubTitle";

const Wrapper = styled.div``;

const Description = styled.p`
  font-size: 10pt;
  padding-bottom: 8px;
`;

const DeveloperTools = styled.div`
  width: 100%;;`

const {TextArea} = Input;

const PageSettingTabItem = () => {
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
    const [developerToolEnabled, setDeveloperToolEnabled] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [storage, setStorage] = useState<string>("");

    return (
        <Wrapper>
            <Title level={5} style={{margin: '0 0 8px'}}>
                {t('page_settings')}
            </Title>
            <Section>
                <SubTitle text={t('init_page_format')}/>
                <Description>{t('init_page_format_description')}</Description>
                <Popconfirm
                    title={t('confirm')}
                    description={t('confirm_description')}
                    onConfirm={onClickInitPageFormat}
                    okText={t('yes')}
                    cancelText={t('no')}
                    zIndex={999999}
                >
                    <Button danger block type="primary">{t('execute')}</Button>
                </Popconfirm>
            </Section>

            <Section>
                <SubTitle text={t('change_eddited_url')}/>
                <Description>{t('change_eddited_url_description')}</Description>
                <TextArea
                    onChange={(value: ChangeEvent<HTMLTextAreaElement>) => {
                        prop.setEdittedUrl(value.currentTarget.value);
                    }}
                    defaultValue={prop.currentUrl}
                    autoSize={{minRows: 1}}
                />
            </Section>

            <Title level={5} style={{margin: '16px 0 8px'}}>
                {t('extension_settings')}
            </Title>
            <Section>
                <SubTitle text={t('init_all_format')}/>
                <Description>{t('init_all_format_description')}</Description>
                <Popconfirm
                    title={t('confirm')}
                    description={t('confirm_description')}
                    onConfirm={onClickInitAllPageFormat}
                    okText={t('yes')}
                    cancelText={t('no')}
                    zIndex={999999}
                >
                    <Button danger block type="primary">{t('execute')}</Button>
                </Popconfirm>
            </Section>

            <Title level={5} style={{margin: '16px 0 8px'}}>
                {t('developer_tools')}
            </Title>

            <Section>
                <Checkbox onChange={(e) => setDeveloperToolEnabled(e.target.checked)}>
                    {t('show_developer_tools')}
                </Checkbox>
            </Section>

            {developerToolEnabled &&
                <DeveloperTools>
                    <Section>
                        <SubTitle text={t('get_css_selector')}/>
                        <Description>{t('get_css_selector_description')}</Description>
                        <p>
                            {elementSelection.selectedElement
                                ? getAbsoluteCSSSelector(elementSelection.selectedElement)
                                : ''}
                        </p>
                    </Section>

                    <Section>
                        <SubTitle text={"【For dev】ストレージ内容を表示"}/>
                        <Description>{"拡張機能のストレージ内容を表示"}</Description>
                        <Button block type="primary" onClick={async () => {
                            setStorage(JSON.stringify(JSON.parse((await chrome.storage.local.get(['formats'])).formats), null, "  "));
                            setIsModalOpen(true);
                        }}>開く</Button>
                        <Modal title="ストレージ内容" open={isModalOpen} onOk={() => setIsModalOpen(false)}
                               onCancel={() => setIsModalOpen(false)} zIndex={99999}>
                            <p style={{textAlign: "left"}}>合計サイズ：{(new Blob([storage])).size / 1000000.0}MB（{(new Blob([storage])).size / 1000.0}KB）/ 5MB</p>
                            <Progress percent={((new Blob([storage])).size / 5000000.0) * 100} showInfo={false}/>
                            <TextArea defaultValue={storage} contentEditable={false}
                                      autoSize={{minRows: 5, maxRows: 20}}/>
                        </Modal>
                    </Section>
                </DeveloperTools>
            }
        </Wrapper>
    );
};

export default PageSettingTabItem;
