import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  applyPageFormat, deleteImportedFormat,
  getImportedFormats,
  ImportedFormatAbstract
} from '../../../features/importStyle';
import t from '../../../features/translator';
import { Button, Card, Popconfirm } from 'antd';
import { IconShoppingBagSearch } from '@tabler/icons-react';
import TabInnerFullHeight from '../../common/TabInnerFullHeight';

const Wrapper = styled.div``;

const DescriptionWrapper = styled.div`
  color: #aaaaaa;
`;

const Author = styled.p`
  padding-bottom: 8px;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 150px;
`;

const Thumbnail = styled.div<{src: string}>`
  width: 100%;
  height: 100%;
  background-image: ${(prop) => `url("${prop.src}")`};
  background-size: cover;
  background-position: center center;
  border-radius: 8px 8px 0 0;
`;

const NodataWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex; 
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
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
          <ThumbnailWrapper>
            <Thumbnail
              src={style.imageUrl ?? 'https://1.bp.blogspot.com/-ezrLFVDoMhg/Xlyf7yQWzaI/AAAAAAABXrA/utIBXYJDiPYJ4hMzRXrZSHrcZ11sW2PiACNcBGAsYHQ/s400/no_image_yoko.jpg'}
            />
          </ThumbnailWrapper>
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
            <Button type='link' style={{color: '#00B7EE'}} onClick={() => onApplyClick(style)} block>
              適用
            </Button>,
          ]}
        >
          <Meta
            title={style.title}
            description={
            <>
              { style.author && <Author>{style.author}</Author>}
              <a href={style.downloadUrl} target={'_blank'}>{t('open_style_link')}</a>
            </>
          }
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
        <TabInnerFullHeight>
          <NodataWrapper>
            <IconShoppingBagSearch size={128} color={'#aaaaaa'} strokeWidth={1.5} />
            <DescriptionWrapper>
              <p>{t('no_imported_styles')}</p>
            </DescriptionWrapper>
            <Button type="link" style={{color: '#00B7EE'}} onClick={onOpenStoreClick} block>
              {t('open_resta_store')}
            </Button>
          </NodataWrapper>
        </TabInnerFullHeight>
      )}
    </Wrapper>
  );
};

export default ImportedStylesList;
