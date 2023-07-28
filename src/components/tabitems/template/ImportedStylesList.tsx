import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ImportedFormatAbstract} from "../../../features/importStyle";
import t from "../../../features/translator";
import {Button} from "antd";

const Wrapper = styled.div`
`;

const DescriptionWrapper = styled.div`
    padding-bottom: 12px;
`;

interface CardsProps {
    styles: ImportedFormatAbstract[];
}

const Cards = ({styles}: CardsProps) => {
    return <>
        {
            styles.map((style) => <p>{style.id}</p>)
        }
    </>;
};

const ImportedStylesList = () => {
    const [styles, setStyles] = useState<ImportedFormatAbstract[]>([]);

    useEffect(() => {
        // TODO
        setStyles([]);
    }, []);

    return (
        <Wrapper>
            {styles.length !== 0 && <Cards styles={styles} /> }
            {
                styles.length === 0 &&
                <>
                    <DescriptionWrapper>
                        <p>{t("no_imported_styles")}</p>
                    </DescriptionWrapper>
                    <Button type="primary" block>
                        {t("open_resta_store")}
                    </Button>
                </>
            }
        </Wrapper>
    );
};

export default ImportedStylesList;