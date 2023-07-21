import React, {useEffect, useState} from "react";
import {StyleSelectionDialogContext, useStyleSelectionDialog} from "../../contexts/StyleSelectionDialogContext";
import {Button, Modal} from "antd";
import t from "../../features/translator";

export default function () {
    const styleSelectionDialog = useStyleSelectionDialog();
    const [loading, setLoading] = useState<boolean>(false);

    const onCancel = () => {
        styleSelectionDialog.setOpened(false);
    }

    const onSubmit = async () => {
        setLoading(true);
        // TODO
        setLoading(false);
        styleSelectionDialog.setOpened(false);
    }

    useEffect(() => {
        const addButton = document.getElementById('resta-add-style');
        if (addButton) {
            addButton.style.display = "block";
            addButton.addEventListener('click', () => {
                styleSelectionDialog.setOpened(true);
            });
        }
    }, []);

    return (
        <StyleSelectionDialogContext.Provider value={styleSelectionDialog}>
            <Modal
                open={styleSelectionDialog.opened}
                title={t('selection_dialog_title')}
                footer={[
                    <Button key="back" onClick={onCancel}>{t('selection_dialog_close')}</Button>,
                    <Button key="submit" loading={loading} type="primary" onClick={onSubmit}>{t('selection_dialog_submit')}</Button>,
                ]}
            >
                <p>test</p>
            </Modal>
        </StyleSelectionDialogContext.Provider>
    )
};