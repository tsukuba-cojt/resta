import styled from 'styled-components';
import React, { Key, useContext, useEffect, useState } from 'react';
import Section from '../common/Section';
import SubTitle from '../common/SubTitle';
import { DataNode } from 'antd/es/tree';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import { Tree, Button } from 'antd';
import { UIUpdaterContext } from '../../../contexts/UIUpdater';
import { getStyleLayer } from '../../../features/style_layer';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import { getAbsoluteCSSSelector } from '../../../utils/CSSUtils';
import { deleteFromAry } from '../../../features/formatter';
import t from '../../../features/translator';
import { updateFormat } from '../../../features/prop';
import { saveFormat } from '../../../features/format_manager';
import { pseudoClassOptions } from '../../../consts/menu';
import { PropsContext } from '../../../contexts/PropsContext';

const Wrapper = styled.div``;

const TreeWrapper = styled.div`
  & > * {
    background-color: transparent;
  }

  & .ant-tree-switcher {
    display: flex;
    align-items: center;
  }
`;

const LayerCustomizer = () => {
  const [tree, setTree] = useState<DataNode[]>([]);
  const updater = useContext(UIUpdaterContext);
  const elementSelection = useContext(ElementSelectionContext);
  const prop = useContext(PropsContext);

  const createTree = (): DataNode[] => {
    if (elementSelection.selectedElement) {
      return (
        (pseudoClassOptions.map(({ label, value }, i) => {
          return {
            title: label,
            key: i,
            selectable: false,
            children: getStyleLayer(
              getAbsoluteCSSSelector(elementSelection.selectedElement!) + value,
              prop,
            ).children.map((child, index) => ({
              title: (
                <span>
                  {t(child.cssKey)}
                  <Button
                    type={'ghost'}
                    onClick={() =>
                      onDeleteStyle(
                        getAbsoluteCSSSelector(
                          elementSelection.selectedElement!,
                        ),
                        child.cssKey,
                        child.id,
                      )
                    }
                    icon={<DeleteOutlined />}
                  />
                </span>
              ),
              key: `${i}-${index}`,
              selectable: false,
              children: [
                {
                  title: child.value,
                  key: `${i}-${index}-0`,
                  selectable: false,
                },
              ],
            })),
          };
        }) as DataNode[]) || []
      );
    }
    return []; // TODO
  };

  const onDeleteStyle = (
    selector: string,
    cssKey: string,
    id: string | number,
  ) => {
    (async () => {
      deleteFromAry(selector, cssKey, id, prop);
      updateFormat(selector, cssKey, prop);
      await saveFormat();
      updater.formatChanged();
    })();
  };

  const onSelect = (_keys: Key[]) => {
    const keys = _keys as string[];
    console.log(keys);

    // TODO
  };

  useEffect(() => {
    setTree(createTree());
    console.log(createTree());
  }, [updater.changeFormatObserver, elementSelection.selectedElement]);

  return (
    <Wrapper>
      <Section>
        <SubTitle text={'適用されたスタイル'} />
        <TreeWrapper>
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandParent={true}
            defaultExpandAll={true}
            onSelect={onSelect}
            treeData={tree}
            style={{ backgroundColor: 'transparent' }}
          />
        </TreeWrapper>
      </Section>
    </Wrapper>
  );
};

export default LayerCustomizer;
