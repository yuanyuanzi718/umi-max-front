import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  PropsWithChildren,
} from 'react';
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Modal,
  Upload,
} from 'antd';
import { create, update } from './service';
const { Option } = Select;
const { TextArea } = Input;
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface EditProps {
  reload: any;
  ref: any;
}

const Edit: React.FC<PropsWithChildren<EditProps>> = forwardRef(
  (props, ref) => {
    const { reload } = props;
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState<any>({});
    const [status, setStatus] = useState(1);
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

    const handleChange: UploadProps['onChange'] = ({
      fileList: newFileList,
    }) => {
      setFileList(newFileList);
    };

    const normFile = (e: any) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    const showDrawer = (value: any) => {
      const { record = {}, status, formDetail = {} } = value;
      if (status === 1) {
        setOpen(true);
        setStatus(status);
        setRecord(record);
        setFileList([]);
        form.resetFields();
      } else {
        setOpen(true);
        setStatus(status);
        setRecord(record);
        setFileList([formDetail.avatar]);
        form.setFieldsValue(formDetail);
      }
    };

    useImperativeHandle(ref, () => ({ showDrawer }));

    const onClose = () => {
      setOpen(false);
    };

    // 提交表单
    const onFinish = async (values: any) => {
      if (fileList && fileList.length === 1) {
        values.avatar = fileList[0];
      }
      if (status === 1) {
        const data = await create({ ...values });
        if (data.success) {
          message.success('新建成功');
          onClose();
          reload.current.reload();
        }
      } else {
        values._id = record._id;
        const data = await update({ ...values });
        if (data.success) {
          message.success('更新成功');
          onClose();
          reload.current.reload();
        }
      }
    };

    const onFinishFailed = () => {
      message.error('请自行检查表单是否填写正确');
    };

    return (
      <Drawer
        title="编辑"
        placement="right"
        onClose={onClose}
        open={open}
        destroyOnClose={true}
        width={900}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Select placeholder="请选择" allowClear>
              <Option value={1}>管理员</Option>
              <Option value={2}>编辑员</Option>
            </Select>
          </Form.Item>
          <Form.Item label="性别" name="gender">
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
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Form.Item>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 0px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 15 }}>
              关闭
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 15 }}
            >
              保存
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  },
);

export default Edit;
