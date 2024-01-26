import styled from 'styled-components';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, List, Modal, Select, Typography, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import Section from '../common/Section';
import SubTitle from '../common/SubTitle';
import {
  deleteUserTemplates,
  saveUserTemplates,
  templateStyleToCssText,
} from '../../../features/userTemplates';
import { PropsContext } from '../../../contexts/PropsContext';
import type { SelectProps } from 'antd';
import t from '../../../features/translator';
import { Template } from '../../../types/Template';
export const CreateTemplateByCss = () => {
  const Description = styled.p`
    font-size: 10pt;
    padding-bottom: 8px;
  `;
  const prop = useContext(PropsContext);
  const { TextArea } = Input;
  const [css, setCss] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const options: SelectProps['options'] = [
    { value: 'all', label: t('all_tags') },
    { value: 'button', label: 'button' },
    { value: 'input', label: 'input' },
    { value: 'a', label: 'a' },
    { value: 'div', label: 'div' },
    { value: 'span', label: 'span' },
    { value: 'p', label: 'p' },
    { value: 'img', label: 'img' },
    { value: 'ul', label: 'ul' },
    { value: 'li', label: 'li' },
    { value: 'h1', label: 'h1' },
    { value: 'h2', label: 'h2' },
    { value: 'h3', label: 'h3' },
  ];

  const [messageApi, contextHolder] = message.useMessage();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // テンプレートの作成
  const onCreateOk = async () => {
    if (css === '') {
      alert('CSSを入力してください');
      return;
    }
    if (templateName === '') {
      alert('テンプレート名を入力してください');
      return;
    }
    const templates = prop.userTemplates;
    if (templates.findIndex((t) => t.name === templateName) > -1) {
      const ok = confirm(
        '同じ名前のテンプレートが存在します。上書きしますか？',
      );
      if (!ok) {
        return;
      }
    }
    if (templateName) {
      try {
        await saveUserTemplates(css, templateName, tags, prop);
        setIsCreateModalOpen(false);
        messageApi.open({
          type: 'success',
          content: 'テンプレートを作成しました',
          duration: 5,
        });
      } catch (e) {
        alert(e);
      }
    }
  };

  // テンプレートの編集
  const edit = (template: Template) => {
    setTemplateName(template.name);
    setTags(template.tags);
    setCss(templateStyleToCssText(template.styles));
    setIsEditModalOpen(true);
  };

  const onEditOk = async () => {
    try {
      await saveUserTemplates(css, templateName, tags, prop);
      setIsEditModalOpen(false);
      messageApi.open({
        type: 'success',
        content: 'テンプレートを作成しました',
        duration: 5,
      });
    } catch (e) {
      alert(e);
    }
  };

  // テンプレートの削除
  const deleteTemplate = async (template: Template) => {
    const ok = confirm('テンプレートを削除しますか？');
    if (ok) {
      await deleteUserTemplates(template.name, prop);
    }
  };

  const onCancel = () => {
    setTemplateName('');
    setCss('');
    setTags([]);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    setCss('');
    setTemplateName('');
    setTags([]);
  }, [isCreateModalOpen]);

  return (
    <>
      {contextHolder}
      <Section>
        <SubTitle text="テンプレートの作成" />
        <Description>CSSを入力してテンプレートを作成します</Description>
        <Button
          block
          type="default"
          onClick={() => {
            setIsCreateModalOpen(true);
          }}
        >
          テンプレートを作成
        </Button>
      </Section>
      <Section>
        <SubTitle text="作成したテンプレート一覧" />
        <List
          dataSource={prop.userTemplates}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item.name}</Typography.Text>
              <div>
                <Button
                  type="ghost"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => edit(item)}
                />
                <Button
                  type="ghost"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteTemplate(item)}
                />
              </div>
            </List.Item>
          )}
        />
      </Section>
      <Modal
        title="テンプレートの作成"
        open={isCreateModalOpen}
        onOk={onCreateOk}
        onCancel={onCancel}
        zIndex={99999}
      >
        <Section>
          テンプレート名
          <Input
            defaultValue={templateName}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            contentEditable={true}
          />
        </Section>
        <Section>
          対象とする要素のタグ名（入力しない場合は全ての要素に適用されます）
          <Select
            mode="tags"
            style={{ width: '100%' }}
            defaultValue={[]}
            value={tags?.length === 0 ? [] : tags}
            tokenSeparators={[',']}
            onChange={setTags}
            options={options}
          />
        </Section>
        <Section>
          CSS
          <TextArea
            defaultValue={css}
            value={css}
            onChange={(e) => setCss(e.target.value)}
            contentEditable={true}
            autoSize={{ minRows: 5, maxRows: 20 }}
          />
        </Section>
      </Modal>
      <Modal
        title="テンプレートの編集"
        open={isEditModalOpen}
        onOk={onEditOk}
        onCancel={onCancel}
        zIndex={99999}
      >
        <Section>
          テンプレート名：
          {templateName}
        </Section>
        <Section>
          CSS
          <TextArea
            defaultValue={css}
            value={css}
            onChange={(e) => setCss(e.target.value)}
            contentEditable={true}
            autoSize={{ minRows: 5, maxRows: 20 }}
          />
        </Section>
      </Modal>
    </>
  );
};
