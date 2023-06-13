import styled from 'styled-components';
import React, { useContext, useState } from 'react';
import { Input } from 'antd';
import t from '../../../features/translator';
import { SearchOutlined } from '@ant-design/icons';
import { TranslatorContext } from '../../../contexts/TranslatorContext';
import SubTitle from '../common/SubTitle';
import Section from '../common/Section';
import BackgroundColorCustomizer from './BackgroundColorCustomizer';
import BorderColorCustomizer from './BorderColorCustomizer';
import BorderRadiusCustomizer from './BorderRadiusCustomizer';
import PaddingCustomizer from './PaddingCustomizer';
import SizeCustomizer from './SizeCustomizer';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import BoxShadowCustomizer from './BoxShadowCustomizer';

const Wrapper = styled.div``;

const InputWrapper = styled.div`
  padding-bottom: 12px;
`;

interface BlockCustomizerProps {
  onChange: (key: string, value: string, id: number) => void;
}

const BlockCustomizer = ({ onChange }: BlockCustomizerProps) => {
  const translator = useContext(TranslatorContext);
  const elementSelection = useContext(ElementSelectionContext);
  const [searchText, setSearchText] = useState<string>('');

  const customizers: { [key: string]: React.JSX.Element } = {
    背景色: <BackgroundColorCustomizer onChange={onChange} />,
    幅と高さ: <SizeCustomizer onChange={onChange} />,
    余白: <PaddingCustomizer onChange={onChange} />,
    角丸: <BorderRadiusCustomizer onChange={onChange} />,
    枠線: <BorderColorCustomizer onChange={onChange} />,
    影: <BoxShadowCustomizer onChange={onChange} />,
  };

  return (
    <Wrapper>
      {elementSelection.selectedElement && (
        <>
          <InputWrapper>
            <Input
              placeholder={t(translator.lang, 'base_search')}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.currentTarget!.value)}
            />
          </InputWrapper>
          {Object.entries(customizers)
            .filter((entry) =>
              searchText
                ? t(translator.lang, entry[0]).includes(searchText)
                : true
            )
            .map(([title, element]) => (
              <Section>
                <SubTitle text={title} />
                {element}
              </Section>
            ))}
        </>
      )}
      {!elementSelection.selectedElement && <p>要素を選択してください</p>}
    </Wrapper>
  );
};

export default BlockCustomizer;
