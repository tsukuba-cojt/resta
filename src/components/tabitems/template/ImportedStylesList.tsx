import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  applyPageFormat, deleteImportedFormat,
  getImportedFormats,
  ImportedFormatAbstract
} from '../../../features/importStyle';
import t from '../../../features/translator';
import { Button, Card, Popconfirm } from 'antd';

const Wrapper = styled.div``;

const DescriptionWrapper = styled.div`
  padding-bottom: 12px;
`;

interface CardsProps {
  styles: ImportedFormatAbstract[];
  updateFunc: () => Promise<void>;
}

const Cards = ({ styles, updateFunc }: CardsProps) => {
  const { Meta } = Card;

  const onApplyClick = (style: ImportedFormatAbstract) => {
    applyPageFormat(style.id);
  };

  const onDeleteClick = (style: ImportedFormatAbstract) => {
    deleteImportedFormat(style.id);
    void updateFunc();
  };

  return (
    <>
      {styles.map((style) => (
        <Card
          bodyStyle={{ padding: '24px' }}
          style={{ marginBottom: '12px' }}
          cover={
            <img
              alt='example'
              src='https://1.bp.blogspot.com/-ezrLFVDoMhg/Xlyf7yQWzaI/AAAAAAABXrA/utIBXYJDiPYJ4hMzRXrZSHrcZ11sW2PiACNcBGAsYHQ/s400/no_image_yoko.jpg'
            />
          }
          actions={[
            <Popconfirm
              title={t('import_popup_title')}
              description={t('import_popup_description')}
              onConfirm={() => onDeleteClick(style)}
              okText={t('yes')}
              cancelText={t('no')}
            >
              <Button type='link' block danger>
                破棄
              </Button>
            </Popconfirm>,
            <Button type='link' onClick={() => onApplyClick(style)} block>
              適用
            </Button>,
          ]}
        >
          <Meta
            title={style.title}
            description={<a href={style.downloadUrl}>{style.downloadUrl}</a>}
          />
        </Card>
      ))}
    </>
  );
};

const ImportedStylesList = () => {
  const [styles, setStyles] = useState<ImportedFormatAbstract[]>([]);

  const onOpenStoreClick = () => {
    window.open('https://resta-frontend.pages.dev/style/', '_blank');
  };

  const updateTree = async () => {
    const styles = getImportedFormats();
    setStyles(styles);
  }

  useEffect(() => {
    void updateTree();
  }, []);

  return (
    <Wrapper>
      {styles.length !== 0 && <Cards styles={styles} updateFunc={updateTree} />}
      {styles.length === 0 && (
        <>
          <DescriptionWrapper>
            <p>{t('no_imported_styles')}</p>
          </DescriptionWrapper>
          <Button type="primary" onClick={onOpenStoreClick} block>
            {t('open_resta_store')}
          </Button>
        </>
      )}
    </Wrapper>
  );
};

export default ImportedStylesList;
