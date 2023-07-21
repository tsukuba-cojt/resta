import styled from 'styled-components';
import React, { useContext } from 'react';
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
import {
  IconLetterSpacing,
  IconSpace,
  IconTypography,
} from '@tabler/icons-react';
import Section from '../common/Section';
import SubTitle from '../common/SubTitle';
import Flex from '../common/Flex';
import { fontUnits, typographyUnits } from '../../../consts/units';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import t from '../../../features/translator';
import { Tooltip } from 'antd';

const Wrapper = styled.div``;

const IW = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(100% - 6px);
`;

interface FontCustomizerProps {
  onChange: (key: string, value: string, id: number | string) => void;
}

const FontCustomizer = ({ onChange }: FontCustomizerProps) => {
  const elementSelection = useContext(ElementSelectionContext);

  return (
    <Wrapper>
      {elementSelection.selectedElement && (
        <>
          <Section>
            <SubTitle text={t('font_title_font')} />
            <Flex>
              <Tooltip title={t('font_prop_bold')}>
                <IconButton
                  icon={<BoldOutlined />}
                  cssKey={'font-weight'}
                  actualValue={'700'}
                  defaultValue={'400'}
                  id={103}
                  onChange={onChange}
                />
              </Tooltip>
              <Tooltip title={t('font_prop_italic')}>
                <IconButton
                  icon={<ItalicOutlined />}
                  cssKey={'font-style'}
                  actualValue={'italic'}
                  defaultValue={'normal'}
                  id={104}
                  onChange={onChange}
                />
              </Tooltip>
              <Tooltip title={t('font_prop_underline')}>
                <IconButton
                  icon={<UnderlineOutlined />}
                  cssKey={'text-decoration'}
                  actualValue={'underline'}
                  defaultValue={'none'}
                  id={105}
                  onChange={onChange}
                />
              </Tooltip>
            </Flex>
          </Section>

          <Section>
            <Flex>
              <Tooltip title={t('font_prop_font')}>
                <IconTypography size={16} strokeWidth={1.5} />
              </Tooltip>
              <TextArea
                cssKey={'font-family'}
                id={101}
                placeHolder={t('font_prop_font')}
                onChange={onChange}
              />
            </Flex>
          </Section>

          <Section>
            <SubTitle text={t('font_title_typography')} />
            <Flex>
              <Tooltip title={t('font_prop_size')}>
                <FontSizeOutlined />
              </Tooltip>
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
              <Tooltip title={t('font_prop_line_spacing')}>
                <LineHeightOutlined />
              </Tooltip>
              <InputNumberWithUnit
                cssKey={'line-height'}
                id={120}
                options={typographyUnits}
                onChange={onChange}
                sliderMin={0}
                sliderMax={2}
                sliderStep={0.1}
                ignores={['normal', 'inherit', 'initial', 'revert', 'unset']}
              />
            </Flex>
          </Section>

          <Section>
            <Flex>
              <Tooltip title={t('font_prop_letter_spacing')}>
                <IconLetterSpacing size={16} strokeWidth={1.5} />
              </Tooltip>
              <InputNumberWithUnit
                cssKey={'letter-spacing'}
                id={121}
                options={typographyUnits}
                onChange={onChange}
                sliderMin={0}
                sliderMax={2}
                sliderStep={0.1}
                ignores={['normal', 'inherit', 'initial', 'unset']}
              />
            </Flex>
          </Section>

          <Section>
            <Flex>
              <Tooltip title={t('font_prop_text_indent')}>
                <IconSpace size={16} strokeWidth={1.5} />
              </Tooltip>
              <InputNumberWithUnit
                cssKey={'text-indent'}
                id={122}
                options={typographyUnits}
                onChange={onChange}
                sliderMin={0}
                sliderMax={2}
                sliderStep={0.1}
                ignores={['inherit', 'initial', 'revert', 'unset']}
              />
            </Flex>
          </Section>

          <Section>
            <Flex>
              <Tooltip title={t('font_prop_color')}>
                <FontColorsOutlined />
              </Tooltip>
              <ColorPicker cssKey={'color'} id={107} onChange={onChange} />
            </Flex>
          </Section>

          <Section>
            <SubTitle text={t('font_title_paragraph')} />
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
