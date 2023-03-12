import { PageContainer } from '@ant-design/pro-components';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  Col,
  Row,
  Card,
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
} from 'antd';
import React, { useState } from 'react';
import { trim } from '@/utils/format';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import services from '@/services/center';
import { useModel } from '@umijs/max';
const { upload } = services.Centercontroller;
const { Meta } = Card;
const { Option } = Select;
const { TextArea } = Input;

const Center: React.FC = () => {
  const [load, setLoad] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const { initialState, setInitialState } = useModel('@@initialState');

  const uploadButton = (
    <div>
      {load ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'uploading') {
      setLoad(true);
      return;
    }
    if (info.file.status === 'done') {
      setImageUrl(info.file.thumbUrl);
      setLoad(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values: any) => {
    const tem = JSON.parse(JSON.stringify(values));
    if (values.avatar && values.avatar.length > 0) {
      tem.avatar = values.avatar[0].thumbUrl;
    }
    const data = await upload({ ...tem });
    if (data.success) {
      message.success('更新成功');
      localStorage.setItem('userinfo', JSON.stringify({ ...tem }));
      setInitialState((s: any) => ({ ...s, userinfo: { ...tem } }));
    }
  };

  const onFinishFailed = () => {
    message.error('请自行检查表单是否填写正确');
  };
  return (
    <PageContainer ghost>
      <Row gutter={16}>
        <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            hoverable
            style={{ width: 240, height: 330 }}
            cover={
              <img
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '75px',
                  marginLeft: '45px',
                  marginTop: '45px',
                }}
                alt="example"
                src={
                  initialState?.userinfo?.avatar
                    ? initialState?.userinfo.avatar
                    : 'https://joesch.moe/api/v1/random'
                }
              />
            }
          >
            <Meta
              style={{ textAlign: 'center' }}
              title={trim(initialState?.userinfo?.username || 'adam')}
              description={
                initialState?.userinfo?.role === 1 ? '管理员' : '编辑'
              }
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="个人信息" style={{ width: '100%' }}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{
                username: initialState?.userinfo?.username,
                gender: initialState?.userinfo?.gender,
                introduction: initialState?.userinfo?.introduction,
                avatar: [{ url: initialState?.userinfo?.avatar }],
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                ]}
              >
                <Input placeholder="请输入" allowClear />
              </Form.Item>
              <Form.Item
                label="性别"
                name="gender"
                rules={[
                  { required: true, message: 'Please input your gender!' },
                ]}
              >
                <Select placeholder="请选择" allowClear>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                  <Option value={3}>不知</Option>
                </Select>
              </Form.Item>
              <Form.Item label="个人简介" name="introduction">
                <TextArea rows={4} placeholder="请输入" allowClear />
              </Form.Item>
              <Form.Item
                name="avatar"
                label="头像"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  name="avatar"
                  maxCount={1}
                  listType="picture-card"
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  更新
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Center;
