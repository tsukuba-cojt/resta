import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {applyPageFormat, getImportedFormats, ImportedFormatAbstract} from "../../../features/importStyle";
import t from "../../../features/translator";
import {Button, Card} from "antd";

const Wrapper = styled.div`
`;

const DescriptionWrapper = styled.div`
    padding-bottom: 12px;
`;

interface CardsProps {
    styles: ImportedFormatAbstract[];
}

const Cards = ({styles}: CardsProps) => {
    const { Meta } = Card;

    const onApplyClick = (style: ImportedFormatAbstract) => {
        applyPageFormat(style.id);
    }

    return <>
        {
            styles.map((style) =>
                <Card
                    bodyStyle={{ padding: '24px' }}
                    style={{ marginBottom: '12px' }}
                    cover={
                        <img
                            alt="example"
                            src="https://1.bp.blogspot.com/-ezrLFVDoMhg/Xlyf7yQWzaI/AAAAAAABXrA/utIBXYJDiPYJ4hMzRXrZSHrcZ11sW2PiACNcBGAsYHQ/s400/no_image_yoko.jpg"
                        />
                    }
                    actions={[
                        /*
                        <Button type="link" block danger>
                            破棄
                        </Button>,*/
                        <Button type="link" onClick={() => onApplyClick(style)} block>
                            適用
                        </Button>
                    ]}
                >
                    <Meta
                        title={style.title}
                        description={<a href={style.downloadUrl}>{style.downloadUrl}</a>}
                    />
                </Card>
            )
        }
    </>;
};

const ImportedStylesList = () => {
    const [styles, setStyles] = useState<ImportedFormatAbstract[]>([]);

    useEffect(() => {
        (async () => {
            const styles = getImportedFormats();
            setStyles(styles);
        })();
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