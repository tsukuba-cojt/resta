import styled from 'styled-components';
import React, {Key, useContext, useEffect, useState} from 'react';
import Section from "../common/Section";
import SubTitle from "../common/SubTitle";
import { DataNode } from 'antd/es/tree';
import {DeleteOutlined, DownOutlined, MehOutlined, SmileOutlined} from "@ant-design/icons";
import {Tree, Button} from "antd";
import {UIUpdaterContext} from "../../../contexts/UIUpdater";
import {getStyleLayer} from "../../../features/style_layer";
import {ElementSelectionContext} from "../../../contexts/ElementSelectionContext";
import {getAbsoluteCSSSelector} from "../../../utils/CSSUtils";
import {deleteFromAry} from "../../../features/formatter";
import t from "../../../features/translator";

const Wrapper = styled.div``;

const TreeWrapper = styled.div`
    & > * {
      background-color: transparent;
    }
`;

const LayerCustomizer = () => {
    const [tree, setTree] = useState<DataNode[]>([]);
    const updater = useContext(UIUpdaterContext);
    const elementSelection = useContext(ElementSelectionContext);

    const createTree = (): DataNode[] => {
        if (elementSelection.selectedElement) {
            console.log(getStyleLayer(getAbsoluteCSSSelector(elementSelection.selectedElement)));

            return [{
                title: '変更',
                key: '0',
                icon: <SmileOutlined />,

                children: getStyleLayer(getAbsoluteCSSSelector(elementSelection.selectedElement)).children.reverse().map((child, index) => (
                    {
                        title: <span>{t(child.cssKey)}<Button type={'ghost'} onClick={() => onDeleteStyle(getAbsoluteCSSSelector(elementSelection.selectedElement!), child.cssKey, child.id)} icon={<DeleteOutlined />} /></span>,
                        key: `0-${index}`,
                        selectable: false,
                        icon: <MehOutlined />,
                    }
                )),
            }];
        }
        return []; // TODO
    }

    const onDeleteStyle = (selector: string, cssKey: string, id: string | number) => {
        deleteFromAry(selector, cssKey, id);
        updater.formatChanged();
    }

    const onSelect = (_keys: Key[]) => {
        const keys = _keys as string[];
        console.log(keys);

        // TODO
    }

    useEffect(() => {
        setTree(createTree());
    }, [updater.changeFormatObserver, elementSelection.selectedElement]);  // TODO inject deps

    return (
        <Wrapper>
            <Section>
                <SubTitle text={"適用されたスタイル"} />
                <TreeWrapper>
                    <Tree
                        showLine
                        switcherIcon={<DownOutlined />}
                        defaultExpandedKeys={['0']}
                        defaultExpandParent={true}
                        defaultExpandAll={true}
                        onSelect={onSelect}
                        treeData={tree}
                        style={{backgroundColor: 'transparent'}}
                    />
                </TreeWrapper>
            </Section>
        </Wrapper>
    );
};

export default LayerCustomizer;
