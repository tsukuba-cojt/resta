import styled from 'styled-components';
import React, { useContext, useEffect } from 'react';
import { TranslatorContext } from '../../../contexts/TranslatorContext';
import TextArea from '../../controls/TextArea';
import RadioGroup from '../../controls/RadioGroup';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  FontColorsOutlined,
  FontSizeOutlined,
  ItalicOutlined,
  LineHeightOutlined,
  UnderlineOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import IconButton from '../../controls/IconButton';
import InputNumberWithUnit from '../../controls/InputNumberWithUnit';
import ColorPicker from '../../controls/ColorPicker';
import { IconLetterSpacing, IconTypography } from '@tabler/icons-react';
import Section from '../common/Section';
import SubTitle from '../common/SubTitle';
import Flex from '../common/Flex';
import { fontUnits } from '../../../consts/units';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';

const Wrapper = styled.div``;

const IW = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(100% - 6px);
`;

interface FontCustomizerProps {
  onChange: (key: string, value: string, id: number) => void;
}

const FontCustomizer = ({ onChange }: FontCustomizerProps) => {
  const translator = useContext(TranslatorContext);
  const elementSelection = useContext(ElementSelectionContext);

  useEffect(() => {
    console.log(translator.lang);
  }, []);

  return (
    <Wrapper>
      {elementSelection.selectedElement && (
        <>
          <Section>
            <SubTitle text={'フォント'} />
            <Flex>
              <IconButton
                icon={<BoldOutlined />}
                cssKey={'font-weight'}
                actualValue={'700'}
                defaultValue={'400'}
                id={103}
                onChange={onChange}
              />
              <IconButton
                icon={<ItalicOutlined />}
                cssKey={'font-style'}
                actualValue={'italic'}
                defaultValue={'normal'}
                id={104}
                onChange={onChange}
              />
              <IconButton
                icon={<UnderlineOutlined />}
                cssKey={'text-decoration'}
                actualValue={'underline'}
                defaultValue={'none'}
                id={105}
                onChange={onChange}
              />
            </Flex>
          </Section>

          <Section>
            <Flex>
              <IconTypography size={16} strokeWidth={1.5} />
              <TextArea
                cssKey={'font-family'}
                id={101}
                placeHolder={'フォント'}
                onChange={onChange}
              />
            </Flex>
          </Section>

          <Section>
            <Flex>
              <FontSizeOutlined />
              <InputNumberWithUnit
                cssKey={'font-size'}
                id={106}
                options={fontUnits}
                onChange={onChange}
                ignores={[
                  'xx-small',
                  'x-small',
                  'small',
                  'medium',
                  'large',
                  'x-large',
                  'xx-large',
                  'xxx-large',
                  'inherit',
                  'initial',
                  'unset',
                ]}
              />
            </Flex>
          </Section>

          <Section>
            <Flex>
              <LineHeightOutlined />
              <InputNumberWithUnit
                cssKey={'line-height'}
                id={120}
                options={fontUnits}
                onChange={onChange}
                ignores={['normal', 'inherit', 'initial', 'revert', 'unset']}
              />
            </Flex>
          </Section>

          <Section>
            <Flex>
              <IconLetterSpacing size={16} strokeWidth={1.5} />
              <InputNumberWithUnit
                cssKey={'letter-spacing'}
                id={121}
                options={fontUnits}
                onChange={onChange}
                ignores={['normal', 'inherit', 'initial', 'unset']}
              />
            </Flex>
          </Section>

          <Section>
            <Flex>
              <FontColorsOutlined />
              <ColorPicker cssKey={'color'} id={107} onChange={onChange} />
            </Flex>
          </Section>

          <Section>
            <SubTitle text={'段落'} />
            <RadioGroup
              cssKey={'text-align'}
              id={102}
              values={{
                left: (
                  <IW>
                    <AlignLeftOutlined />
                  </IW>
                ),
                center: (
                  <IW>
                    <AlignCenterOutlined />
                  </IW>
                ),
                right: (
                  <IW>
                    <AlignRightOutlined />
                  </IW>
                ),
              }}
              onChange={onChange}
            />
          </Section>

          <Section>
            <RadioGroup
              cssKey={'vertical-align'}
              id={109}
              values={{
                top: (
                  <IW>
                    <VerticalAlignTopOutlined />
                  </IW>
                ),
                middle: (
                  <IW>
                    <VerticalAlignMiddleOutlined />
                  </IW>
                ),
                bottom: (
                  <IW>
                    <VerticalAlignBottomOutlined />
                  </IW>
                ),
              }}
              onChange={onChange}
            />
          </Section>
        </>
      )}
      {!elementSelection.selectedElement && <p>要素を選択してください</p>}
    </Wrapper>
  );
};

export default FontCustomizer;
