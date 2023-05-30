import styled from "styled-components";
import Title from "antd/lib/typography/Title";
import React from "react";
import {ChangeStyleElement, LayoutPart} from "../types/ChangeStyleElement";
import {Collapse, Input, InputNumber, Select} from "antd";
import {CSSParseResultElementType} from "../types/RestaSetting";
import t from "../utils/translator";
import {setFormatAndPushToAry} from "../formatter";
//import {createXPathFromElement} from "../xpath_control";
import useHoveredAndSelectedElement from "../hooks/useHoveredAndSelectedElement";
import getXPath from "get-xpath";

const Wrapper = styled.div`
`;

const CollapseWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
`;

const Description = styled.p`
  font-size: 10pt;
  padding-bottom: 12px;
`;

const {Panel} = Collapse;

interface CategoryProps {
    title: string;
    elements: ChangeStyleElement[];
}

const ChangeStyleCategory = ({title, elements}: CategoryProps) => {

    const [_, selectedElement] = useHoveredAndSelectedElement();

    const isNumberWithUnit = (parts: LayoutPart[]) => {
        return parts.length == 2
            && parts[0].type === CSSParseResultElementType.NUMBER
            && parts[1].type === CSSParseResultElementType.SELECT;
    }

    return <Wrapper>
        <Title level={5}>{t(title)}</Title>
        <CollapseWrapper>
            <Collapse size="small">
                {elements.map((element, index) =>
                    <Panel key={index} header={t(element.name)}>
                        <Description>{t(element.description)}</Description>
                        {
                            isNumberWithUnit(element.parts) &&
                            <InputNumber addonAfter={
                                <Select
                                    defaultValue={element.parts[1].options![0]}
                                    onChange={() => {
                                    }}
                                    options={element.parts[1].options!.map((option) => {
                                        return {value: option, label: option};
                                    })}
                                    dropdownStyle={{zIndex: 99999}}
                                />
                            }
                                   key={index}
                            />
                        }
                        {
                            !isNumberWithUnit(element.parts) && element.parts.map((part, index) =>
                                <>
                                    {part.type === CSSParseResultElementType.SELECT &&
                                        <Select
                                            key={index}
                                            defaultValue={part.options![0]}
                                            onChange={(value) => {
                                                console.log(getXPath(selectedElement), element.key, value);
                                                setFormatAndPushToAry(getXPath(selectedElement), element.key, value);
                                            }}
                                            options={part.options!.map((option) => {
                                                return {value: option, label: option};
                                            })}
                                            dropdownStyle={{zIndex: 99999}}
                                        />
                                    }
                                    {part.type === CSSParseResultElementType.STRING &&
                                        <Input key={index}/>
                                    }
                                    {part.type === CSSParseResultElementType.NUMBER &&
                                        <InputNumber key={index}/>
                                    }
                                    {part.type === CSSParseResultElementType.RAWTEXT &&
                                        <span>{part.text}</span>
                                    }
                                </>
                            )
                        }
                    </Panel>
                )}
            </Collapse>
        </CollapseWrapper>
    </Wrapper>
};

export default ChangeStyleCategory;