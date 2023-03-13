import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  PropsWithChildren,
} from 'react';
import { Button, Drawer, Form, Input, message, Select, Upload } from 'antd';
import { create, update } from './service';
const { Option } = Select;
const { TextArea } = Input;

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
    const [load, setLoad] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const formMap = (value: any) => {
      let tem = JSON.parse(JSON.stringify(value));
      if (tem.avatar) {
        tem.avatar = [{ url: value?.avatar }];
      }
      return tem;
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
        form.setFieldsValue(formMap(formDetail));
      }
    };

    useImperativeHandle(ref, () => ({ showDrawer }));

    const onClose = () => {
      setOpen(false);
    };

    // 头像
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
    // 提交表单
    const onFinish = async (values: any) => {
      const tem = JSON.parse(JSON.stringify(values));
      if (values.avatar && values.avatar.length > 0) {
        tem.avatar = values.avatar[0].thumbUrl;
      }
      if (status === 1) {
        const data = await create({ ...tem });
        if (data.success) {
          message.success('新建成功');
          onClose();
          reload.current.reload();
        }
      } else {
        tem._id = record._id;
        const data = await update({ ...tem });
        if (data.success) {
          message.success('修改成功');
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
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
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
