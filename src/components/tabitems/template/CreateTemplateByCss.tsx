import styled from 'styled-components';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from 'antd';
import Section from '../common/Section';
import SubTitle from '../common/SubTitle';
import { saveUserTemplates } from '../../../features/userTemplates';
import { PropsContext } from '../../../contexts/PropsContext';
import type { SelectProps } from 'antd';
import t from '../../../features/translator';
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setCss('');
    setTemplateName('');
    setTags([]);
  }, [isModalOpen]);

  return (
    <Section>
      <SubTitle text={'テンプレートの作成'} />
      <Description>{'CSSを入力してテンプレートを作成します'}</Description>
      <Button
        block
        type="default"
        onClick={async () => {
          setIsModalOpen(true);
        }}
      >
        開く
      </Button>
      <Modal
        title="テンプレートの作成"
        open={isModalOpen}
        onOk={() => {
          if (css === '') {
            alert('CSSを入力してください');
            return;
          }
          if (templateName === '') {
            alert('テンプレート名を入力してください');
            return;
          }
          saveUserTemplates(css, templateName, tags, prop)
            .then(() => {
              setIsModalOpen(false);
            })
            .catch((e) => {
              alert(e);
            });
        }}
        onCancel={() => setIsModalOpen(false)}
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
          対象とする要素のタグ名(入力しない場合は全ての要素に適用されます)
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
    </Section>
  );
};
