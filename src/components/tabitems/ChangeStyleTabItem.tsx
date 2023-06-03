import styled from "styled-components";
import t from "../../features/translator";
//import Title from "antd/lib/typography/Title";
import React, {useContext, useEffect, useState} from "react";
import {TranslatorContext} from "../../contexts/TranslatorContext";
import useHoveredAndSelectedElement from "../../hooks/useHoveredAndSelectedElement";
import {ChangeStyleCategoryMap, ChangeStyleElement} from "../../types/ChangeStyleElement";
import {downloadLangJson} from "../../features/setting_downloader";
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import getXPath from "get-xpath";
import ChangeStyleCategory from "../ChangeStyleCategory";

const Wrapper = styled.div`
`;

const InputWrapper = styled.div`
`;

interface ChangeStyleTabItemProps {
  categoryMap: ChangeStyleCategoryMap;
}

const ChangeStyleTabItem = ({ categoryMap }: ChangeStyleTabItemProps) => {
  const translator = useContext(TranslatorContext);
  const [_, selectedElement] = useHoveredAndSelectedElement();
  const [searchText, setSearchText] = useState<string>('');

  const filter = ([key, elements]: [string, ChangeStyleElement[]]): boolean => {
    if (searchText.length == 0) {
      return true;
    }

    return (
      t(translator.lang, key).includes(searchText) ||
      elements.some((element) =>
        t(translator.lang, element.name).includes(searchText)
      ) ||
      elements.some((element) => element.key.includes(searchText))
    );
  };

  useEffect(() => {
    (async () => {
      console.log(1234);
      translator.setLanguage(await downloadLangJson());
    })();
  }, []);

  return (
    <Wrapper>
      <InputWrapper>
        <Input
          placeholder={t(translator.lang, 'base_search')}
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.currentTarget!.value)}
        />
      </InputWrapper>
      <p>{ getXPath(selectedElement)}</p>
      {searchText.length >= 0 &&
        Object.entries(categoryMap)
          .filter(filter)
          .map((elements, index) => (
            <ChangeStyleCategory
              searchText={searchText}
              title={elements[0]}
              elements={elements[1]}
              key={index}
            />
          ))}
    </Wrapper>
  )
};

export default ChangeStyleTabItem;