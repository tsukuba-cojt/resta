import styled from 'styled-components';
import t from '../../features/translator';
//import Title from "antd/lib/typography/Title";
import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../contexts/TranslatorContext';
import {
  ChangeStyleCategoryMap,
  ChangeStyleElement,
} from '../../types/ChangeStyleElement';
import { downloadLangJson } from '../../features/setting_downloader';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ChangeStyleCategory from '../ChangeStyleCategory';

const Wrapper = styled.div``;

const InputWrapper = styled.div``;

interface ChangeStyleTabItemProps {
  categoryMap: ChangeStyleCategoryMap;
}

const ChangeStyleTabItem = ({ categoryMap }: ChangeStyleTabItemProps) => {
  const translator = useContext(TranslatorContext);
  const [searchText, setSearchText] = useState<string>('');

  const filter = ([key, elements]: [string, ChangeStyleElement[]]): boolean => {
    if (searchText.length == 0) {
      return true;
    }

    return (
      t(key).includes(searchText) ||
      elements.some((element) => t(element.name).includes(searchText)) ||
      elements.some((element) => element.key.includes(searchText))
    );
  };

  useEffect(() => {
    (async () => {
      translator.setLanguage(await downloadLangJson());
    })();
  }, []);

  return (
    <Wrapper>
      <InputWrapper>
        <Input
          placeholder={t('base_search')}
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.currentTarget!.value)}
        />
      </InputWrapper>
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
  );
};

export default ChangeStyleTabItem;
