import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Template } from '../../../types/Template';
import TemplateCard from './TemplateCard';
import { ElementSelectionContext } from '../../../contexts/ElementSelectionContext';
import { PropsContext } from '../../../contexts/PropsContext';
import { CreateTemplateByCss } from './CreateTemplateByCss';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;

  p {
    margin-top: 16px;
    color: gray;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.5);
  border: lightgray solid 1px;
  border-radius: 24px;
`;

interface CardsProps {
  templates: Template[];
}

const Cards = ({ templates }: CardsProps) => {
  const elementSelection = useContext(ElementSelectionContext);
  return (
    <>
      {templates
        .filter(
          (t) =>
            t.tags.includes(
              elementSelection.selectedElement!.tagName.toLowerCase(),
            ) || t.tags.includes('all'),
        )
        .map((t) => (
          <TemplateCard template={t} />
        ))}
    </>
  );
};

interface TemplateListProps {
  templates: Template[];
}

const TemplateList = ({ templates }: TemplateListProps) => {
  const elementSelection = useContext(ElementSelectionContext);
  const [length, setLength] = useState<number>(0);
  const prop = useContext(PropsContext);

  useEffect(() => {
    if (elementSelection.selectedElement) {
      setLength(
        templates.filter(
          (t) =>
            t.tags.includes(
              elementSelection.selectedElement!.tagName.toLowerCase(),
            ) || t.tags.includes('all'),
        ).length +
          prop.userTemplates.filter(
            (t) =>
              t.tags.includes(
                elementSelection.selectedElement!.tagName.toLowerCase(),
              ) || t.tags.includes('all'),
          ).length,
      );
    } else {
      setLength(0);
    }
  }, [elementSelection.selectedElement]);

  return (
    <>
      <Wrapper>
        <CreateTemplateByCss />
      </Wrapper>
      {elementSelection.selectedElement && length !== 0 && (
        <Wrapper>
          <p>ボタンをクリックすることでテンプレートを適用することができます</p>
          <CardsWrapper>
            <Cards templates={prop.userTemplates} />
            <Cards templates={templates} />
          </CardsWrapper>
        </Wrapper>
      )}
      {length === 0 && <p>この要素に適用できるテンプレートはありません</p>}
    </>
  );
};

export default TemplateList;
