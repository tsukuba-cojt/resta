import styled from 'styled-components';
import React, { useCallback, useMemo } from 'react';
import { Tabs } from 'antd';
import t from '../../../features/translator';
// @ts-ignore
import categories from '../../../consts/json/templates.json';
import { TemplateCategory } from '../../../types/Template';
import Scrollable from '../common/Scrollable';
import TemplateList from './TemplateList';
import ImportedStylesList from './ImportedStylesList';

const Wrapper = styled.div``;

const TabWrapper = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;

  .ant-tabs-tab {
    padding-top: 0;
  }
`;

const TemplateCustomizer = () => {
  // const [searchText, setSearchText] = useState<string>('');
  const categoriesArray = useMemo<TemplateCategory[]>(
    () => categories.categories as TemplateCategory[],
    [],
  );

  const items = useCallback(() => {
    const categories = [{
      label: t('imported_styles'),
      key: 'imported_styles',
      children: <ImportedStylesList />,
    }];

    categories.push(...categoriesArray.map((category, i) => ({
      label: t(category.name),
      key: i.toString(),
      children: <TemplateList templates={category.templates} />,
    })));

    return categories;
  }, [categoriesArray]);

  return (
    <Wrapper>
      <TabWrapper>
        <Scrollable>
          <Tabs items={items()} />
        </Scrollable>
      </TabWrapper>
    </Wrapper>
  );
};

export default TemplateCustomizer;
