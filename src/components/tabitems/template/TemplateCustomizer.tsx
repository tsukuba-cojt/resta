import styled from 'styled-components';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import {Input, Tabs} from 'antd';
import t from '../../../features/translator';
import { SearchOutlined } from '@ant-design/icons';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
// @ts-ignore
import categories from '../../../consts/templates.json';
import {TemplateCategory} from "../../../types/Template";
import Scrollable from "../common/Scrollable";
import TemplateList from "./TemplateList";

const Wrapper = styled.div``;

const InputWrapper = styled.div`
  padding-bottom: 12px;
`;

const TabWrapper = styled.div`
  overflow-y: hidden;
`;

const TemplateCustomizer = () => {
  const elementSelection = useContext(ElementSelectionContext);
  const [searchText, setSearchText] = useState<string>('');
  const categoriesArray = useMemo<TemplateCategory[]>(() => categories.categories as TemplateCategory[], []);

  const items = useCallback(() => categoriesArray.map((category, i) => {
    return {
      label: t(category.name),
      key: i.toString(),
      children: <TemplateList templates={category.templates} />,
    };
  }), [categoriesArray]);

  return (
    <Wrapper>
      {elementSelection.selectedElement && (
        <>
          <InputWrapper>
            <Input
              placeholder={t('base_search')}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.currentTarget!.value)}
              value={searchText}
            />
          </InputWrapper>
          <TabWrapper>
            <Scrollable>
              <Tabs items={items()} tabBarGutter={0} />
            </Scrollable>
          </TabWrapper>
        </>
      )}
      {!elementSelection.selectedElement && <p>要素を選択してください</p>}
    </Wrapper>
  );
};

export default TemplateCustomizer;
