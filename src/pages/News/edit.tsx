import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  PropsWithChildren,
} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Button,
  Drawer,
  Modal,
  Form,
  Input,
  message,
  Select,
  Upload,
} from 'antd';
import { create, update } from './service';
const { Option } = Select;
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Edit: React.FC<PropsWithChildren<any>> = forwardRef((props, ref) => {
  const { reload } = props;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [status, setStatus] = useState(1);
  const [value, setValue] = useState<any>('');

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

  const showDrawer = (value: any) => {
    const { record = {}, status, formDetail = {} } = value;
    if (status === 1) {
      setOpen(true);
      setStatus(status);
      setRecord(record);
      form.resetFields();
    } else {
      setOpen(true);
      setStatus(status);
      setRecord(record);
      setFileList([formDetail.cover]);
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
      values.cover = fileList[0];
    }
    if (status === 1) {
      values.isPublish = 1; //   1 已发布 2 未发布,
      const data = await create({ ...values });
      if (data.success) {
        message.success('新建成功');
        onClose();
        reload.current.reload();
      }
    } else {
      values._id = record._id;
      values.isPublish = record.isPublish;
      const data = await update({ ...values });
      if (data.success) {
        message.success('新建成功');
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
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: '请输入' }]}
        >
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        </Form.Item>
        <Form.Item
          label="类型"
          name="category"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Select placeholder="请选择" allowClear>
            <Option value={1}>最新动态</Option>
            <Option value={2}>典型案例</Option>
            <Option value={3}>通知公告</Option>
          </Select>
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
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default Edit;
