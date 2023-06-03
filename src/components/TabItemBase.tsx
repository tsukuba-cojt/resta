import styled from "styled-components";
import t from "../features/translator";
import Title from "antd/lib/typography/Title";
import React from "react";
import {useTranslator} from "../contexts/TranslatorContext";

const Wrapper = styled.div`
  
`;

interface TabItemBaseProps {
  titleKey: string;
}

const TabItemBase = ({titleKey}: TabItemBaseProps) => {
  const translator = useTranslator();
  return (
    <Wrapper>
      <Title level={4}>{t(translator.lang, titleKey)}</Title>
    </Wrapper>
  )
};

export default TabItemBase;