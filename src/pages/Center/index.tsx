import { PageContainer } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
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
  Modal,
} from 'antd';
import React, { useState } from 'react';
import { trim } from '@/utils/format';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import services from '@/services/center';
import { useModel } from '@umijs/max';
const { upload } = services.Centercontroller;
const { Meta } = Card;
const { Option } = Select;
const { TextArea } = Input;
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Center: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<any>([]);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values: any) => {
    if (fileList && fileList.length === 1) {
      values.avatar = fileList[0];
    }
    const data = await upload({ ...values });
    if (data.success) {
      message.success('更新成功');
      localStorage.setItem('userinfo', JSON.stringify({ ...values }));
      setInitialState((s: any) => ({ ...s, userinfo: { ...values } }));
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
                  initialState?.userinfo?.avatar?.thumbUrl
                    ? initialState?.userinfo.avatar?.thumbUrl
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
                  <Option value={3}>未知</Option>
                </Select>
              </Form.Item>
              <Form.Item label="个人简介" name="introduction">
                <TextArea rows={4} placeholder="请输入" allowClear />
              </Form.Item>
              <Form.Item
                label="封面图片"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                </Modal>
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
