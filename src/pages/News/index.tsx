import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Popconfirm, Button, message, Space, Modal, Divider } from 'antd';
import React, { useRef, useState } from 'react';
import Edit from './edit';
import { getList, statusOperation, del } from './service';
import styles from './index.scss';
const NewsList: React.FC<unknown> = () => {
  const actionRef = useRef<any>();
  const editRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [preview, setpreview] = useState<any>({});

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

  const statusOperationHandler = async (record: any) => {
    if (record) {
      const data: any = await statusOperation({
        _id: record._id,
        isPublish: record.isPublish === 1 ? 2 : 1,
      });
      if (data.success) {
        if (record.isPublish === 1) {
          message.success('下线成功');
        } else {
          message.success('上线成功');
        }
        actionRef.current.reload();
      }
    }
  };

  const deleteHandler = async (record: any) => {
    const data: any = await del(record._id);
    if (data.success) {
      message.success('删除成功');
      actionRef.current.reload();
    }
  };

  // 预览
  const previewHandler = (record: any) => {
    setIsModalOpen(true);
    setpreview(record);
  };

  const columns: any = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '20%',
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: '20%',
      valueEnum: {
        1: { text: '最新动态' },
        2: { text: '典型案例' },
        3: { text: '通知公告' },
      },
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
      title: '是否发布',
      dataIndex: 'isPublish',
      key: 'isPublish',
      width: '20%',
      valueEnum: {
        1: { text: '已发布', status: 'Success' },
        2: { text: '未发布', status: 'Error' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: '20%',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => previewHandler(record)}>
            预览
          </Button>
          <Button type="link" onClick={() => openEditHandler(record)}>
            详情
          </Button>
          <Button type="link" onClick={() => statusOperationHandler(record)}>
            {record.isPublish === 1 ? '下线' : '上线'}
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
      <Modal
        title="新闻预览"
        width={800}
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <h3 style={{ textAlign: 'center' }}>{preview.title}</h3>
        <Divider />
        <div
          className={styles.divBox}
          dangerouslySetInnerHTML={{ __html: preview.content }}
        ></div>
      </Modal>
    </PageContainer>
  );
};
export default NewsList;
