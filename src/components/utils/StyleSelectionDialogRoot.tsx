import React, {useEffect, useState} from "react";
import {StyleSelectionDialogContext, useStyleSelectionDialog} from "../../contexts/StyleSelectionDialogContext";
import {Button, Modal, Space, Radio} from "antd";
import t from "../../features/translator";
import styled from "styled-components";
import {RadioChangeEvent} from "antd/es/radio/interface";
import {getChangedUrls} from "../../features/output_style";
import {enableRestaAddStyleButton, injectStyleJson} from "../../features/upload_import_manager";

const RadioButtonsWrapper = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

export default function () {
    const styleSelectionDialog = useStyleSelectionDialog();
    const [loading, setLoading] = useState<boolean>(false);
    const [urls, setUrls] = useState<string[]>([]);
    const [value, setValue] = useState<number>(0);

    const onCancel = () => {
        styleSelectionDialog.setOpened(false);
    }

    const onSubmit = async () => {
        setLoading(true);
        await injectStyleJson(urls[value]);
        setLoading(false);
        styleSelectionDialog.setOpened(false);
    }

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        enableRestaAddStyleButton(() => styleSelectionDialog.setOpened(true));
        (async () => setUrls(await getChangedUrls()))();
    }, []);

    return (
        <StyleSelectionDialogContext.Provider value={styleSelectionDialog}>
            <Modal
                centered
                open={styleSelectionDialog.opened}
                title={t('selection_dialog_title')}
                onCancel={onCancel}
                footer={urls.length == 0 ?
                    [
                        <Button key="back" onClick={onCancel}>{t('selection_dialog_close')}</Button>
                    ] :
                    [
                        <Button key="back" onClick={onCancel}>{t('selection_dialog_close')}</Button>,
                        <Button key="submit" loading={loading} type="primary" onClick={onSubmit}>{t('selection_dialog_submit')}</Button>,
                    ]
            }
            >
                { urls.length > 0 &&
                    <RadioButtonsWrapper>
                        <Radio.Group onChange={onChange} value={value}>
                            <Space direction="vertical">
                                {
                                    urls.map((url, index) => <Radio key={index} value={index}>{ url }</Radio>)
                                }
                            </Space>
                        </Radio.Group>
                    </RadioButtonsWrapper>
                }
                { urls.length == 0 &&
                    <p>{ t('selection_dialog_no_contents') }</p>
                }
            </Modal>
        </StyleSelectionDialogContext.Provider>
    )
};