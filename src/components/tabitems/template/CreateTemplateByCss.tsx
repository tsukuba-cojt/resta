import styled from 'styled-components';
import React, { useContext, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import Section from '../common/Section';
import SubTitle from '../common/SubTitle';
import { saveUserTemplates } from '../../../features/userTemplates';
import { PropsContext } from '../../../contexts/PropsContext';
export const CreateTemplateByCss = () => {
  const Description = styled.p`
    font-size: 10pt;
    padding-bottom: 8px;
  `;
  const prop = useContext(PropsContext);
  const { TextArea } = Input;
  const [css, setCss] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
          saveUserTemplates(css, templateName, [], prop)
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
        テンプレート名
        <Input
          defaultValue={templateName}
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          contentEditable={true}
        />
        CSS
        <TextArea
          defaultValue={css}
          value={css}
          onChange={(e) => setCss(e.target.value)}
          contentEditable={true}
          autoSize={{ minRows: 5, maxRows: 20 }}
        />
      </Modal>
    </Section>
  );
};
