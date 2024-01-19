import styled from 'styled-components';
import React, { useContext, useEffect, useRef, useState } from 'react';
// import TextArea from '../../controls/TextArea';
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
  PlusOutlined,
  UnderlineOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import IconButton from '../../controls/IconButton';
import InputNumberWithUnit from '../../controls/InputNumberWithUnit';
import ColorPicker from '../../controls/ColorPicker';
import {
  IconClick,
  IconLetterSpacing,
  IconSpace,
  IconTypography
} from '@tabler/icons-react';
import Section from '../common/Section';
import SubTitle from '../common/SubTitle';
import Flex from '../common/Flex';
import { fontUnits, typographyUnits } from '../../../consts/units';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import t from '../../../features/translator';
import { Button, Divider, Input, InputRef, Select, Space, Tooltip } from 'antd';
import type { SelectProps } from 'antd';
import opentype from 'opentype.js';
import { defaultFontFamilies } from '../../../consts/cssValues';
import { getCssSelector, kebabToCamel } from '../../../utils/CSSUtils';
import { setFormatsAndPushToAry } from '../../../features/formatter';
import { PropsContext } from '../../../contexts/PropsContext';
import NoItem from '../common/NoItem';

const Wrapper = styled.div``;

const IW = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(100% - 6px);
`;

const FontItem = styled.span<{ family: string }>`
  font-family: ${(props) => props.family};
`;

const { Option } = Select;

const FontCustomizer = () => {
  const elementSelection = useContext(ElementSelectionContext);
  //const [defaultFonts, setDefaultFonts] = useState<string[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);
  const [installedFonts, setInstalledFonts] = useState<SelectProps['options']>(
    [],
  );
  const [fontName, setFontName] = useState<string>('');
  const prop = useContext(PropsContext);

  const inputRef = useRef<InputRef>(null);

  const onFontNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontName(event.target.value);
  };

  const addFont = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (fontName) {
      e.preventDefault();
      setInstalledFonts([
        ...(installedFonts ?? []),
        { label: fontName, value: fontName },
      ]);
      setFontName('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const onChangeFonts = (values: string[]) => {
    setSelectedFonts(values);
    const value = values
      .map((font) => (defaultFontFamilies.includes(font) ? font : `"${font}"`))
      .join(', ');
    onChange('font-family', value, 'font-family');
  };

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

  useEffect(() => {
    (async () => {
      if (!('queryLocalFonts' in window)) {
        return;
      }

      const result: SelectProps['options'] = [];

      interface FontData {
        family: string;
        fullName: string;
        postscriptName: string;
        style: string;
        blob: () => Promise<Blob>;
      }

      const queryLocalFonts = async (): Promise<FontData[]> => {
        // @ts-ignore
        return window.queryLocalFonts();
      };

      const push = (name: string) => {
        result.push({
          label: name,
          value: name,
        });
      };

      const NULL_FONT = '#@~null~@#';
      const fonts: FontData[] = await queryLocalFonts();
      const localCache: { [key: string]: string } =
        (await chrome.storage.local.get('fonts')).fonts ?? {};

      for (const font of fonts) {
        const blob = await font.blob();
        const sfntVersion = await blob.slice(0, 4).text();

        if (
          sfntVersion !== '\x00\x01\x00\x00' &&
          sfntVersion !== 'true' &&
          sfntVersion !== 'typ1' &&
          sfntVersion !== 'OTTO'
        ) {
          continue;
        }

        const cache = localCache[font.postscriptName];
        if (cache) {
          if (cache !== NULL_FONT) {
            push(cache);
          }
          continue;
        }

        try {
          const data = opentype.parse(await blob.arrayBuffer());
          const name = data.names.fontFamily.ja ?? data.names.fontFamily.en;
          if (name && !result.find((r) => r.label === name)) {
            push(name);
            localCache[font.postscriptName] = name;
          } else {
            localCache[font.postscriptName] = NULL_FONT;
          }
        } catch {
          continue;
        }
      }

      await chrome.storage.local.set({ fonts: localCache });

      defaultFontFamilies.forEach((font) => {
        push(font);
      });

      setInstalledFonts(result);
    })();
  }, []);

  useEffect(() => {
    if (elementSelection.selectedElement) {
      const style = getComputedStyle(elementSelection.selectedElement);
      const value = (style as any)[kebabToCamel('font-family')] as string;
      const fonts = value
        .split(/,\s*/)
        .map((text) => text.replace(/^(["'])/, '').replace(/(["'])$/, ''));
      setSelectedFonts(fonts);
    }
  }, [elementSelection.selectedElement]);

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
                  actualValue={'bold'}
                  defaultValue={'normal'}
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
              <Select
                mode="multiple"
                optionLabelProp="label"
                style={{ width: '100%' }}
                placeholder={t('font_prop_font')}
                tokenSeparators={[',']}
                onChange={onChangeFonts}
                //options={installedFonts}
                loading={!installedFonts?.length}
                value={installedFonts?.length ? selectedFonts : []}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder={t('add_new_font')}
                        ref={inputRef}
                        value={fontName}
                        onChange={onFontNameChange}
                      />
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addFont}
                      >
                        {t('add')}
                      </Button>
                    </Space>
                  </>
                )}
              >
                {(installedFonts ?? []).map((font, index) => (
                  <Option key={index} value={font.value} label={font.label}>
                    <FontItem family={font.value as string}>
                      {font.label}
                    </FontItem>
                  </Option>
                ))}
              </Select>
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
      {!elementSelection.selectedElement &&
        <NoItem icon={<IconClick size={96} color={'#999999'} />} offset={140} text={"要素を選択してください"}>
          <p>ヒント：編集したい要素の上でマウスをクリックすることで要素を選択できます。</p>
        </NoItem>
      }
    </Wrapper>
  );
};

export default FontCustomizer;
