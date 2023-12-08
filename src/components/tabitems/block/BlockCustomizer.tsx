import styled from 'styled-components';
import React, { useContext, useState } from 'react';
import { Input } from 'antd';
import t from '../../../features/translator';
import { SearchOutlined } from '@ant-design/icons';
import SubTitle from '../common/SubTitle';
import Section from '../common/Section';
import BackgroundColorCustomizer from './BackgroundColorCustomizer';
import BorderColorCustomizer from './BorderColorCustomizer';
import BorderRadiusCustomizer from './BorderRadiusCustomizer';
import PaddingCustomizer from './PaddingCustomizer';
import SizeCustomizer from './SizeCustomizer';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import BoxShadowCustomizer from './BoxShadowCustomizer';
import { PropsContext } from '../../../contexts/PropsContext';
import { setFormatsAndPushToAry } from '../../../features/formatter';
import { getAbsoluteCSSSelector } from '../../../utils/CSSUtils';

const Wrapper = styled.div``;

const InputWrapper = styled.div`
  padding-bottom: 12px;
`;

const BlockCustomizer = () => {
  const elementSelection = useContext(ElementSelectionContext);
  const [searchText, setSearchText] = useState<string>('');
  const prop = useContext(PropsContext);

  const onChange = (key: string, value: string, id: number | string) => {
    if (elementSelection.selectedElement) {
      setFormatsAndPushToAry(
        [
          {
            id,
            cssSelector:
              getAbsoluteCSSSelector(elementSelection.selectedElement) +
              elementSelection.selectedPseudoClass,
            values: [{ key, value }],
          },
        ],
        prop,
      );
    }
  };

  const customizers: { [key: string]: React.JSX.Element } = {
    背景色: <BackgroundColorCustomizer onChange={onChange} />,
    幅と高さ: <SizeCustomizer onChange={onChange} />,
    余白: <PaddingCustomizer onChange={onChange} />,
    角丸: <BorderRadiusCustomizer onChange={onChange} />,
    影: <BoxShadowCustomizer onChange={onChange} />,
    枠線: <BorderColorCustomizer onChange={onChange} />,
  };

  return (
    <Wrapper>
      {elementSelection.selectedElement && (
        <>
          <InputWrapper>
            <Input
              placeholder={t('base_search')}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.currentTarget!.value)}
            />
          </InputWrapper>
          {Object.entries(customizers)
            .filter((entry) =>
              searchText ? t(entry[0]).includes(searchText) : true,
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
