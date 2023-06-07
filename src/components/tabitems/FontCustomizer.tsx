import styled from "styled-components";
import React, {useContext, useEffect, useState} from "react";
import {setFormatAndPushToAry} from "../../features/formatter";
import {getAbsoluteCSSSelector} from "../../utils/CSSUtils";
import {TranslatorContext} from "../../contexts/TranslatorContext";
import useHoveredAndSelectedElement from "../../hooks/useHoveredAndSelectedElement";
import TextArea from "../controls/TextArea";
import SubTitle from "../typography/SubTitle";
import RadioGroup from "../controls/RadioGroup";
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined, BgColorsOutlined,
  BoldOutlined, FontColorsOutlined, FontSizeOutlined,
  ItalicOutlined, UnderlineOutlined
} from "@ant-design/icons";
import IconButton from "../controls/IconButton";
import InputNumberWithUnit from "../controls/InputNumberWithUnit";
import ColorPicker from "../controls/ColorPicker";
import {
  IconAlignBoxCenterBottom,
  IconAlignBoxCenterMiddle,
  IconAlignBoxCenterTop, IconTypography
} from "@tabler/icons-react";

const Wrapper = styled.div``;

const Section = styled.div`
  padding-bottom: 12px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
`;

const FontCustomizer = () => {
  const translator = useContext(TranslatorContext);
  const [_, selectedElement] = useHoveredAndSelectedElement();
  const [updateIndex, setUpdateIndex] = useState<number>(0);

  const onChange = (key: string, value: string, id: number) => {
    if (selectedElement) {
      setFormatAndPushToAry(getAbsoluteCSSSelector(selectedElement), key, value, id);
      setUpdateIndex(updateIndex + 1);
    }
  };

  useEffect((() => {
    console.log(translator.lang)
  }), []);

  return (
    <Wrapper>
      {selectedElement &&
        <>
          <Section>
            <SubTitle text={'フォント'}/>
            <Flex>
              <IconButton icon={<BoldOutlined/>} cssKey={"font-weight"} actualValue={"700"} defaultValue={"400"}
                          id={103} onChange={onChange}/>
              <IconButton icon={<ItalicOutlined/>} cssKey={"font-style"} actualValue={"italic"} defaultValue={"normal"}
                          id={104} onChange={onChange}/>
              <IconButton icon={<UnderlineOutlined/>} cssKey={"text-decoration"} actualValue={"underline"} defaultValue={"none"}
                          id={105} onChange={onChange}/>
            </Flex>
          </Section>

          <Section>
            <Flex>
              <IconTypography size={16} strokeWidth={1.5} />
              <TextArea cssKey={'font-family'} id={101} placeHolder={"フォント"} onChange={onChange}/>
            </Flex>
          </Section>

          <Section>
            <Flex>
              <FontSizeOutlined/>
              <InputNumberWithUnit cssKey={"font-size"} id={106} options={["pt", "rem", "em", "px"]} onChange={onChange}/>
            </Flex>
          </Section>

          <Section>
            <Flex>
              <FontColorsOutlined/>
              <ColorPicker cssKey={"color"} id={107} onChange={onChange}/>
            </Flex>
          </Section>

          <Section>
            <Flex>
              <BgColorsOutlined/>
              <ColorPicker cssKey={"background-color"} id={108} onChange={onChange}/>
            </Flex>
          </Section>

          <Section>
            <SubTitle text={'段落'}/>
            <RadioGroup cssKey={"text-align"} id={102}
                        values={{
                          'left': <AlignLeftOutlined/>,
                          "center": <AlignCenterOutlined/>,
                          "right": <AlignRightOutlined/>
                        }}
                        onChange={onChange}/>
          </Section>

          <Section>
            <RadioGroup cssKey={"vertical-align"} id={109}
                        values={{
                          'top': <IconAlignBoxCenterTop strokeWidth={1.5} width={"1.0em"} height={"1.0em"}/>,
                          "middle": <IconAlignBoxCenterMiddle strokeWidth={1.5} width={"1.0em"} height={"1.0em"}/>,
                          "bottom": <IconAlignBoxCenterBottom strokeWidth={1.5} width={"1.0em"} height={"1.0em"}/>
                        }}
                        onChange={onChange}/>
          </Section>
        </>
      }
      {!selectedElement &&
        <p>要素を選択してください</p>
      }
    </Wrapper>
  );
};

export default FontCustomizer;