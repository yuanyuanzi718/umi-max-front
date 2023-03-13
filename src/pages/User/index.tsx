import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Popconfirm, Button, message, Space } from 'antd';
import React, { useRef } from 'react';
import Edit from './edit';
import { getList, detail, del } from './service';

const UserList: React.FC<unknown> = () => {
  const actionRef = useRef<any>();
  const editRef = useRef<any>(null);

  // 新建/详情
  const openEditHandler = async (record?: any) => {
    if (record) {
      const data: any = await detail(record._id);
      if (data.success) {
        editRef.current.showDrawer({
          status: 2, // 1 代表新建 2 代表修改
          record: record,
          formDetail: data.data,
        });
      }
    } else {
      editRef.current.showDrawer({
        status: 1,
        record: {},
      });
    }
  };

  const deleteHandler = async (record: any) => {
    const data: any = await del(record._id);
    if (data.success) {
      message.success('删除成功');
      actionRef.current.reload();
    }
  };
  const columns: any = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: '20%',
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: '20%',
      valueEnum: {
        1: { text: '管理员', status: '1' },
        2: { text: '编辑员', status: '2' },
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      search: false,
      width: '20%',
      valueEnum: {
        1: { text: '男', status: '1' },
        2: { text: '女', status: '2' },
        3: { text: '未知', status: '3' },
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      valueType: 'avatar',
      search: false,
      width: '20%',
      render: (dom: any) => (
        <Space>
          <span>{dom}</span>
        </Space>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: '20%',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => openEditHandler(record)}>
            详情
          </Button>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => {
              deleteHandler(record);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button danger type="link">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer ghost>
      <ProTable<API.UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key="1" type="primary" onClick={() => openEditHandler()}>
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data, success } = await getList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data?.list || [],
            success,
            total: data?.list?.length,
          };
        }}
        columns={columns}
      />
      <Edit reload={actionRef} ref={editRef} />
    </PageContainer>
  );
};
export default UserList;
