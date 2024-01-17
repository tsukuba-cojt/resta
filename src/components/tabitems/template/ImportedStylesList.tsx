import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  applyPageFormat,
  deleteImportedFormat,
  getImportedFormats,
  ImportedFormatAbstract,
} from '../../../features/importStyle';
import t from '../../../features/translator';
import { Button, Card, Popconfirm } from 'antd';
import { PropsContext } from '../../../contexts/PropsContext';
import { IconShoppingBagX } from '@tabler/icons-react';
import NoItem from '../common/NoItem';

const Wrapper = styled.div``;

const Author = styled.p`
  padding-bottom: 8px;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 150px;
`;

const Thumbnail = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  background-image: ${(prop) => `url("${prop.src}")`};
  background-size: cover;
  background-position: center center;
  border-radius: 8px 8px 0 0;
`;

interface CardsProps {
  styles: ImportedFormatAbstract[];
  updateFunc: () => Promise<void>;
}

const Cards = ({ styles, updateFunc }: CardsProps) => {
  const { Meta } = Card;
  const props = useContext(PropsContext);

  const onApplyClick = (style: ImportedFormatAbstract) => {
    applyPageFormat(style.id, props);
  };

  const onDeleteClick = (style: ImportedFormatAbstract) => {
    deleteImportedFormat(style.id, props);
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
                src={
                  style.imageUrl ??
                  'https://1.bp.blogspot.com/-ezrLFVDoMhg/Xlyf7yQWzaI/AAAAAAABXrA/utIBXYJDiPYJ4hMzRXrZSHrcZ11sW2PiACNcBGAsYHQ/s400/no_image_yoko.jpg'
                }
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
              <Button type="link" block danger>
                破棄
              </Button>
            </Popconfirm>,
            <Button type="link" onClick={() => onApplyClick(style)} block>
              適用
            </Button>,
          ]}
        >
          <Meta
            title={style.title}
            description={
              <>
                {style.author && <Author>{style.author}</Author>}
                <a href={style.downloadUrl} target={'_blank'}>
                  {t('open_style_link')}
                </a>
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
  const props = useContext(PropsContext);

  const updateTree = async () => {
    const styles = getImportedFormats(props);
    setStyles(styles);
  };

  useEffect(() => {
    void updateTree();
  }, []);

  return (
    <Wrapper>
      {styles.length !== 0 && <Cards styles={styles} updateFunc={updateTree} />}
      {styles.length === 0 && (
        <NoItem icon={<IconShoppingBagX size={96} color={'#999999'} />} text={t('no_imported_styles')}>
          <Button type="link" onClick={() => window.open('https://resta-frontend.pages.dev/style/', '_blank')} block>
            <span style={{color: '#00b7ee'}}>{t('open_resta_store')}</span>
          </Button>
        </NoItem>
      )}
    </Wrapper>
  );
};

export default ImportedStylesList;
