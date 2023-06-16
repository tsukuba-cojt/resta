import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";
import {Template} from "../../../types/Template";
import TemplateCard from "./TemplateCard";
import {ElementSelectionContext} from "../../../contexts/ElementSelectionContext";

const Wrapper = styled.div`
`;

interface TemplateListProps {
  templates: Template[]
}

const TemplateList = ({templates}: TemplateListProps) => {
  const elementSelection = useContext(ElementSelectionContext);
  const [length, setLength] = useState<number>(0);

  useEffect(() => {
    if (elementSelection.selectedElement) {
      setLength(templates.filter((t) => t.tags.includes(elementSelection.selectedElement!.tagName.toLowerCase())).length);
    } else {
      setLength(0);
    }
  }, [elementSelection.selectedElement])

  return (
    <Wrapper>
      {elementSelection.selectedElement && length !== 0 &&
        templates
          .filter((t) => t.tags.includes(elementSelection.selectedElement!.tagName.toLowerCase()))
          .map((t) => <TemplateCard template={t}/>)
      }
      {
        length === 0 &&
        <p>この要素に適用できるテンプレートはありません</p>
      }
    </Wrapper>
  );
};

export default TemplateList;