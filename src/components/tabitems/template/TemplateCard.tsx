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
      template.styles.forEach((style) =>
        (style.pseudoClasses ?? ['']).forEach((pseudoClass) =>
          setFormatsAndPushToAry([
            {
              id: getId(`${pseudoClass ? ':' : ''}${pseudoClass}`),
              cssSelector: getAbsoluteCSSSelector(elementSelection.selectedElement!) + `${pseudoClass ? ':' : ''}${pseudoClass}`,
              values: Object.entries(style.css).map(([key, value]) => ({key, value}))
            }
          ])
        )
      );
      updater.formatChanged();

      /*
      setFormatsAndPushToAry([
        {
          cssSelector: getAbsoluteCSSSelector(elementSelection.selectedElement),
          values: Object.entries(template.styles[0].css).map(([key, value]) => ({key, value}))
        }
      ]);

       */
    }
  }

  const getId = (additional: string = '') => Array.from(template.name + additional).map((v) => v.charCodeAt(0)).reduce((s, e) => s + e, 0);

  const insertCSS = () => {
    template.styles.forEach((style) => {
      getStyleSheet()?.insertRule(
        `${(style.pseudoClasses ?? ['']).map((v) => `${getAbsoluteCSSSelector(ref.current!)}[id='${template.name}']${v ? ':' : ''}${v}`).join(", ")} {\n`
        + `${Object.entries(style.css).map(([key, value]) => `${key}: ${value}`).join(";\n")};\n`
        + '}'
      );
    });
  }

  useEffect(() => {
    insertCSS();
  }, []);

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