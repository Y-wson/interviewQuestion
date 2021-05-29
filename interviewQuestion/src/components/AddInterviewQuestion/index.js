import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import * as api from '@/services/api';
import BraftEditor from 'braft-editor';
import Editor from '@/components/Editor';
import _ from 'lodash';

const { Option } = Select;

const AddInterviewQuestion = props => {
  const { getFieldDecorator } = props.form;
  const { onCancel, questionDetail, operationType } = props;
  const editorState =
    props.operationType === 'update'
      ? BraftEditor.createEditorState(_.get(props, 'questionDetail.analysis', null))
      : BraftEditor.createEditorState(null);
  const [editor, setEditor] = useState(editorState);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    getClass();
  }, []);

  const onCreate = e => {
    const { operationType, getData, onCancel, questionDetail } = props;
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const html = editor.toHTML();
        if (operationType === 'add') {
          api
            .createJsQuestion({ ...values, analysis: html })
            .then(() => {
              onCancel();
            })
            .catch(() => {
              onCancel();
            })
            .finally(() => {
              getData();
            });
        } else {
          api
            .updateJsQuestion({ ...values, id: questionDetail.id, analysis: html })
            .then(response => {
              onCancel();
            })
            .catch(() => {
              onCancel();
            })
            .finally(() => {
              getData();
            });
        }
      }
    });
  };

  const onChange = editorState => {
    setEditor(editorState);
  };

  const getClass = () => {
    api.getClasses().then(response => {
      setClassList(response);
    });
  };

  return (
    <Form className="login-form" onSubmit={onCreate}>
      <Row gutter={32}>
        <Col span={8}>
          <Form.Item>
            {getFieldDecorator('title', {
              initialValue: operationType === 'add' ? undefined : questionDetail.title,
              rules: [
                {
                  required: true,
                  message: '请输入试题名称!',
                },
              ],
            })(<Input placeholder="请输入试题名称" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item>
            {getFieldDecorator('classId', {
              initialValue: operationType === 'add' ? undefined : questionDetail.className,
              rules: [
                {
                  required: true,
                  message: '请选择分类!',
                },
              ],
            })(
              <Select placeholder="请选择分类">
                {classList.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Editor onChange={onChange} editorState={editor} />
      </Form.Item>
      <Form.Item label={<span></span>} colon={false} style={{ textAlign: 'right' }}>
        <Button style={{ marginRight: 24 }} onClick={onCancel}>
          取消
        </Button>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(AddInterviewQuestion);
