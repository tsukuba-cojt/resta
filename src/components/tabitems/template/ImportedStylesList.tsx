import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ImportedFormatAbstract} from "../../../features/importStyle";
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
                        <Button type="link" block danger>
                            破棄
                        </Button>,
                        <Button type="link" block>
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
        // TODO
        setStyles([
            {id: '1234', title: "テスト1", downloadUrl: "https://resta-frontend.dev/"},
            {id: '5678', title: "テスト1", downloadUrl: "https://resta-frontend.dev/"},
        ]);
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