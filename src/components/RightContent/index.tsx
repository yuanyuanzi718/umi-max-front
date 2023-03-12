import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { history, useModel } from '@umijs/max';
import { Dropdown, Space, Avatar } from 'antd';

const onClick: MenuProps['onClick'] = ({ key }) => {
  if (key === '1') {
    history.push('/center');
  } else if (key === '2') {
    localStorage.removeItem('token');
    localStorage.removeItem('userinfo');
    history.push('/login');
  }
};

const items: MenuProps['items'] = [
  {
    label: '个人中心',
    key: '1',
  },
  {
    label: '退出登陆',
    key: '2',
  },
];
// 脚手架示例组件
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  return (
    <Space wrap size={10}>
      <Avatar
        size="large"
        src={
          initialState?.userinfo?.avatar
            ? initialState?.userinfo.avatar
            : 'https://joesch.moe/api/v1/random'
        }
      />
      <Dropdown menu={{ items, onClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {initialState?.userinfo?.username || 'adam'}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Space>
  );
};

export default Index;
