import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { Card, Avatar, Carousel } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
const { Meta } = Card;

const HomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  return (
    <PageContainer ghost>
      <Card style={{ width: '100%', marginBottom: 100 }}>
        <Meta
          avatar={
            <Avatar
              src={
                initialState?.userinfo?.avatar?.thumbUrl
                  ? initialState?.userinfo.avatar?.thumbUrl
                  : 'https://joesch.moe/api/v1/random'
              }
            />
          }
          title={trim(initialState?.userinfo?.username || 'adam')}
        />
      </Card>
      <Card title="公司产品" style={{ width: '100%' }}>
        <Carousel autoplay>
          <div>
            <h3 className={styles.contentStyle}>1</h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>2</h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>3</h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>4</h3>
          </div>
        </Carousel>
      </Card>
    </PageContainer>
  );
};

export default HomePage;
