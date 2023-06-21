import styled from 'styled-components';
import React, {Key, useContext, useEffect, useState} from 'react';
import Section from "../common/Section";
import SubTitle from "../common/SubTitle";
import { DataNode } from 'antd/es/tree';
import {DownOutlined} from "@ant-design/icons";
import {Tree} from "antd";
import {UIUpdaterContext} from "../../../contexts/UIUpdater";

const Wrapper = styled.div``;

const LayerCustomizer = () => {
    const [tree, setTree] = useState<DataNode[]>([]);
    const updater = useContext(UIUpdaterContext);

    const createTree = (): DataNode[] => {
        return []; // TODO
    }

    const onSelect = (_keys: Key[]) => {
        const keys = _keys as string[];
        console.log(keys);
        // TODO
    }

    useEffect(() => {
        setTree(createTree());
    }, [updater.changeFormatObserver]);  // TODO inject deps

    return (
        <Wrapper>
            <Section>
                <SubTitle text={"適用されたスタイル"} />
                <Tree
                    showLine
                    switcherIcon={<DownOutlined />}
                    defaultExpandedKeys={['0-0-0']}
                    onSelect={onSelect}
                    treeData={tree}
                />
            </Section>
        </Wrapper>
    );
};

export default LayerCustomizer;
