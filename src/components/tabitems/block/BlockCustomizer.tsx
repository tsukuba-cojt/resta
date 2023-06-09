import styled from "styled-components";
import useHoveredAndSelectedElement from "../../../hooks/useHoveredAndSelectedElement";
import React, {useContext, useState} from "react";
import {Input} from "antd";
import t from "../../../features/translator";
import {SearchOutlined} from "@ant-design/icons";
import {TranslatorContext} from "../../../contexts/TranslatorContext";
import SubTitle from "../common/SubTitle";
import Section from "../common/Section";
import BackgroundColorCustomizer from "./BackgroundColorCustomizer";
import {setFormatAndPushToAry} from "../../../features/formatter";
import {getAbsoluteCSSSelector} from "../../../utils/CSSUtils";
import BorderColorCustomizer from "./BorderColorCustomizer";

const Wrapper = styled.div``;

const InputWrapper = styled.div`
  padding-bottom: 12px;
`;

const BlockCustomizer = () => {
  const translator = useContext(TranslatorContext);
  const [_, selectedElement] = useHoveredAndSelectedElement();
  const [searchText, setSearchText] = useState<string>('');

  const onChange = (key: string, value: string, id: number) => {
    if (selectedElement) {
      setFormatAndPushToAry(getAbsoluteCSSSelector(selectedElement), key, value, id);
    }
  };

  const customizers: { [key: string]: React.JSX.Element } = {
    '背景色': <BackgroundColorCustomizer onChange={onChange}/>,
    '枠線': <BorderColorCustomizer onChange={onChange}/>
  }

  return (
    <Wrapper>
      {selectedElement &&
        <>
          <InputWrapper>
            <Input
              placeholder={t(translator.lang, 'base_search')}
              prefix={<SearchOutlined/>}
              onChange={(e) => setSearchText(e.currentTarget!.value)}
            />
          </InputWrapper>
          {
            Object.entries(customizers)
              .filter((entry) => searchText ? t(translator.lang, entry[0]).includes(searchText) : true)
              .map(([title, element]) => (
                <Section>
                  <SubTitle text={title}/>
                  {element}
                </Section>
              ))
          }
        </>
      }
      {!selectedElement &&
        <p>要素を選択してください</p>
      }
    </Wrapper>
  );
};

export default BlockCustomizer;