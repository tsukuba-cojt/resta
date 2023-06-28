import {Template} from "../../../types/Template";
import {Button, Card} from "antd";
import t from "../../../features/translator";
import React, {useContext, useEffect, useRef} from "react";
import {getAbsoluteCSSSelector} from "../../../utils/CSSUtils";
import styled from "styled-components";
import {ElementSelectionContext} from "../../../contexts/ElementSelectionContext";
import {setFormatsAndPushToAry} from "../../../features/formatter";
import {getStyleSheet} from "../../../features/style_sheet";
import {UIUpdaterContext} from "../../../contexts/UIUpdater";
import {createId} from "../../../utils/IDUtils";

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
  const ref = useRef<any>(null);
  const elementSelection = useContext(ElementSelectionContext);
  const updater = useContext(UIUpdaterContext);

  const onUseClick = () => {
    if (elementSelection.selectedElement) {
      setFormatsAndPushToAry(template.styles.map((style) => ({
        id: createId(),
        cssSelector: getAbsoluteCSSSelector(elementSelection.selectedElement!) + (style.pseudoClass ? `:${style.pseudoClass}` : ''),
        values: Object.entries(style.css).map(([key, value]) => ({key, value}))
      })));

      updater.formatChanged();
    }
  }

  const insertCSS = () => {
    template.styles.forEach((style) => {
      getStyleSheet()?.insertRule(
        `${getAbsoluteCSSSelector(ref.current!)}[id='${template.name}']${style.pseudoClass ? `:${style.pseudoClass}` : ''} {\n`
        + `${Object.entries(style.css).map(([key, value]) => `${key}: ${value}`).join(";\n")};\n`
        + '}'
      );
    });
  }

  useEffect(() => insertCSS(), []);

  return (
    <Card
      title={t(template.name)}
      bordered={true}
      bodyStyle={{padding: "24px"}}
      style={{marginBottom: "12px"}}
      extra={<Button type={"link"} onClick={onUseClick}>適用</Button>}>
      <InnerWrapper>
        {template.tags[0] === "a" && <a ref={ref} id={template.name} href={"#"}>ボタン</a>}
        {template.tags[0] === "button" && <button ref={ref} id={template.name}>ボタン</button>}
      </InnerWrapper>
    </Card>
  );
};

export default TemplateCard;