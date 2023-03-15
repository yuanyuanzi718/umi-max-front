import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Popconfirm, Button, message, Space } from 'antd';
import React, { useRef } from 'react';
import Edit from './edit';
import { getList, del } from './service';
const Product: React.FC<unknown> = () => {
  const actionRef = useRef<any>();
  const editRef = useRef<any>(null);

  // 新建/详情
  const openEditHandler = async (record?: any) => {
    if (record) {
      editRef.current.showDrawer({
        status: 2, // 1 代表新建 2 代表修改
        record: record,
        formDetail: record,
      });
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
      title: '产品名称',
      dataIndex: 'title',
      width: '20%',
    },
    {
      title: '简要描述',
      dataIndex: 'introduction',
      width: '20%',
    },
    {
      title: '更新时间',
      dataIndex: 'editTime',
      valueType: 'date',
      search: false,
      sorter: true,
      width: '20%',
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
export default Product;
