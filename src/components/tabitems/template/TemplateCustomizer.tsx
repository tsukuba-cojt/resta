import styled from 'styled-components';
import React, {useCallback, useContext, useMemo} from 'react';
import {Tabs} from 'antd';
import t from '../../../features/translator';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
// @ts-ignore
import categories from '../../../consts/templates.json';
import {TemplateCategory} from "../../../types/Template";
import Scrollable from "../common/Scrollable";
import TemplateList from "./TemplateList";
import ImportedStylesList from "./ImportedStylesList";

const Wrapper = styled.div``;

/*
const InputWrapper = styled.div`
  padding-bottom: 12px;
`;
 */

const TabWrapper = styled.div`
  overflow-y: hidden;
  
  .ant-tabs-tab {
    padding-top: 0;
  }
`;

const TemplateCustomizer = () => {
  const elementSelection = useContext(ElementSelectionContext);
  // const [searchText, setSearchText] = useState<string>('');
  const categoriesArray = useMemo<TemplateCategory[]>(() => categories.categories as TemplateCategory[], []);

  const items = useCallback(() => {
    const categories = categoriesArray.map((category, i) => (
      {
        label: t(category.name),
        key: i.toString(),
        children: <TemplateList templates={category.templates} />,
      })
    );

    categories.push({
      label: t('imported_styles'),
      key: 'imported_styles',
      children: <ImportedStylesList />,
    });

    return categories;
  }, [categoriesArray]);

  return (
    <Wrapper>
      {elementSelection.selectedElement && (
        <>
          {/* TODO #144: 検索の実装
          <InputWrapper>
            <Input
              placeholder={t('base_search')}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.currentTarget!.value)}
              value={searchText}
            />
          </InputWrapper>
          */}
          <TabWrapper>
            <Scrollable>
              <Tabs items={items()} />
            </Scrollable>
          </TabWrapper>
        </>
      )}
      {!elementSelection.selectedElement && <p>要素を選択してください</p>}
    </Wrapper>
  );
};

export default TemplateCustomizer;
