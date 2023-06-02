import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Title from 'antd/lib/typography/Title';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  ChangeStyleCategoryMap,
  ChangeStyleElement,
} from '../types/ChangeStyleElement';
import ChangeStyleCategory from './ChangeStyleCategory';
import {
  TranslatorContext,
  useTranslator,
} from '../contexts/TranslatorContext';
import t from '../utils/translator';
import { downloadLangJson } from '../features/setting_downloader';
import { saveFormat } from '../features/formatter';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #f0f0f099;
  box-sizing: border-box;
  overflow-y: auto;

  border-radius: 8px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* ぼかしエフェクト */
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-right-color: rgba(255, 255, 255, 0.2);
  border-bottom-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 16px 0 #f0f0f0;
`;

const InputWrapper = styled.div`
  padding-bottom: 16px;
`;

interface BaseProps {
  categoryMap: ChangeStyleCategoryMap;
}

const Base = ({ categoryMap }: BaseProps) => {
  const translator = useTranslator();
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

  useEffect(() => console.log(searchText), [searchText]);

  return (
    <Wrapper>
      <TranslatorContext.Provider value={translator}>
        <Title level={4}>{t(translator.lang, 'base_change_style')}</Title>
        <InputWrapper>
          <Input
            placeholder={t(translator.lang, 'base_search')}
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
        <Button onClick={saveFormat}>
          {t(translator.lang, 'save_button')}
        </Button>
      </TranslatorContext.Provider>
    </Wrapper>
  );
};

export default Base;
