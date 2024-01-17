import styled from 'styled-components';
import React, { useContext } from 'react';
import SubTitle from '../common/SubTitle';
import Section from '../common/Section';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import BoxShadowCustomizer from './BoxShadowCustomizer';
import { PropsContext } from '../../../contexts/PropsContext';
import { setFormatsAndPushToAry } from '../../../features/formatter';
import { getCssSelector } from '../../../utils/CSSUtils';
import InteractiveStyler from './styler/InteractiveStyler';
import NoItem from '../common/NoItem';
import { IconClick } from '@tabler/icons-react';

const Wrapper = styled.div``;

const InteractiveStylerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 16px;
`;

const BlockCustomizer = () => {
  const elementSelection = useContext(ElementSelectionContext);
  const prop = useContext(PropsContext);

  const onChange = (key: string, value: string, id: number | string) => {
    if (elementSelection.selectedElement) {
      setFormatsAndPushToAry(
        [
          {
            id,
            cssSelector:
              getCssSelector(
                elementSelection.selectElementBy,
                elementSelection.selectedElement,
              ) + elementSelection.selectedPseudoClass,
            values: [{ key, value }],
          },
        ],
        prop,
      );
    }
  };

  const customizers: { [key: string]: React.JSX.Element } = {
    // 背景色: <BackgroundColorCustomizer onChange={onChange} />,
    // 幅と高さ: <SizeCustomizer onChange={onChange} />,
    // 余白: <PaddingCustomizer onChange={onChange} />,
    // 角丸: <BorderRadiusCustomizer onChange={onChange} />,
    影: <BoxShadowCustomizer onChange={onChange} />,
    // 枠線: <BorderColorCustomizer onChange={onChange} />,
  };

  return (
    <Wrapper>
      {elementSelection.selectedElement && (
        <>
          <InteractiveStylerWrapper>
            <InteractiveStyler />
          </InteractiveStylerWrapper>
          {Object.entries(customizers)
            .map(([title, element]) => (
              <Section>
                <SubTitle text={title} />
                {element}
              </Section>
            ))}
        </>
      )}
      {!elementSelection.selectedElement &&
        <NoItem icon={<IconClick size={96} color={'#999999'} />} offset={140} text={"要素を選択してください"}>
          <p>ヒント：編集したい要素の上でマウスをクリックすることで要素を選択できます。</p>
        </NoItem>
      }
    </Wrapper>
  );
};

export default BlockCustomizer;
