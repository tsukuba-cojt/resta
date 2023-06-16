import {Template} from "../../../types/Template";
import {Button, Card} from "antd";
import t from "../../../features/translator";
import React, {useContext, useEffect, useRef} from "react";
import {getAbsoluteCSSSelector, kebabToCamel} from "../../../utils/CSSUtils";
import styled from "styled-components";
import {ElementSelectionContext} from "../../../contexts/ElementSelectionContext";
import {setFormatsAndPushToAry} from "../../../features/formatter";

const InnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  & > * {
    box-sizing: border-box;
    width: 100% !important;
  }
`;

interface TemplateCardProps {
  template: Template;
}

const TemplateCard = ({template}: TemplateCardProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const elementSelection = useContext(ElementSelectionContext);

  const onUseClick = () => {
    if (elementSelection.selectedElement) {
      setFormatsAndPushToAry([
        {
          cssSelector: getAbsoluteCSSSelector(elementSelection.selectedElement),
          values: Object.entries(template.styles[0].css).map(([key, value]) => ({key, value}))
        }
      ]);
    }
  }

  useEffect(() => {
    Object.entries(template.styles[0].css).forEach(([key, value]) => {
      // @ts-ignore
      ref.current!.style[kebabToCamel(key)] = value;
    });
  });

  return (
    <Card
      title={t(template.name)}
      bordered={true}
      bodyStyle={{padding: "24px"}}
      extra={<Button type={"link"} onClick={onUseClick}>適用</Button>}>
      {template.styles[0].tags![0] === "a" &&
        <InnerWrapper>
          <a ref={ref} href={"#"}>ボタン</a>
        </InnerWrapper>
      }
    </Card>
  );
};

export default TemplateCard;