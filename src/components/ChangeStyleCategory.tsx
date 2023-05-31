import styled from "styled-components";
import Title from "antd/lib/typography/Title";
import React, {useContext} from "react";
import {ChangeStyleElement, LayoutPart} from "../types/ChangeStyleElement";
import {Collapse, Input, InputNumber} from "antd";
import {CSSParseResultElementType} from "../types/RestaSetting";
import t from "../utils/translator";
import {setFormatAndPushToAry} from "../features/formatter";
import useHoveredAndSelectedElement from "../hooks/useHoveredAndSelectedElement";
import getXPath from "get-xpath";
import InputNumberWithUnit from "./controls/InputNumberWithUnit";
import Select from "./controls/Select";
import {TranslatorContext} from "../contexts/TranslatorContext";

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
    const translator = useContext(TranslatorContext);
    const [_, selectedElement] = useHoveredAndSelectedElement();

    const onChange = (key: string, value: string) => {
        console.log(getXPath(selectedElement), key, value);
        setFormatAndPushToAry(getXPath(selectedElement), key, value);
    }

    const isNumberWithUnit = (parts: LayoutPart[]) => {
        return parts.length == 2
            && parts[0].type === CSSParseResultElementType.NUMBER
            && parts[1].type === CSSParseResultElementType.SELECT;
    }

    return <Wrapper>
        <Title level={5}>{t(translator.lang, title)}</Title>
        <CollapseWrapper>
            <Collapse size="small">
                {elements.map((element, index) =>
                    <Panel key={index} header={t(translator.lang, element.name)}>
                        <Description>{t(translator.lang, element.description)}</Description>
                        {
                            isNumberWithUnit(element.parts) &&
                            <InputNumberWithUnit key={index} element={element} onChange={onChange} />
                        }
                        {
                            !isNumberWithUnit(element.parts) && element.parts.map((part, index) =>
                                <>
                                    {part.type === CSSParseResultElementType.SELECT &&
                                        <Select key={index} cssKey={element.key} part={part} onChange={onChange}/>
                                    }
                                    {part.type === CSSParseResultElementType.STRING &&
                                        <Input key={index} onChange={(value) => onChange(element.key, value.currentTarget.value)}/>
                                    }
                                    {part.type === CSSParseResultElementType.NUMBER &&
                                        <InputNumber key={index} onChange={(value) => onChange(element.key, value?.toString() ?? "")}/>
                                    }
                                    {part.type === CSSParseResultElementType.RAWTEXT &&
                                        <span key={index}>{part.text}</span>
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