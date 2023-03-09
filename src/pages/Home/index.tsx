import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { Card, Avatar, Carousel } from 'antd';
import React, { useEffect, useState } from 'react';
const { Meta } = Card;

const HomePage: React.FC = () => {
  const user: any = localStorage.getItem('userinfo')
  const [userinfo] = useState<any>(JSON.parse(user))
  useEffect(() => {

  }, []);
  return (
    <PageContainer ghost>
      <Card
        style={{ width: '100%', marginBottom: 100 }}
      >
        <Meta
          avatar={<Avatar src={userinfo?.avatar ? userinfo.avatar : "https://joesch.moe/api/v1/random"} />}
          title={trim(userinfo?.username || 'adam')}
        />
      </Card>
      <Card
        title="公司产品"
        style={{ width: '100%', }}
      >
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

    </PageContainer >
  );
};

export default HomePage;
