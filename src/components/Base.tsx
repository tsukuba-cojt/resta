import React from "react";
import styled from "styled-components";
import Title from "antd/lib/typography/Title";
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {ChangeStyleCategoryMap} from "../types/ChangeStyleElement";
import ChangeStyleCategory from "./ChangeStyleCategory";


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

const Base = ({categoryMap}: BaseProps) => {
    return (
        <Wrapper>
            <Title level={4}>スタイルの変更</Title>
            <InputWrapper>
                <Input placeholder="検索" prefix={<SearchOutlined/>}/>
            </InputWrapper>
            {
                Object.entries(categoryMap).map((values, index) =>
                    <ChangeStyleCategory title={values[0]} elements={values[1]} key={index}/>
                )
            }
        </Wrapper>
    )
};

export default Base;