import React, { useEffect, useState } from 'react';
import { Form, Modal, Radio, Select, Spin, Tag } from 'antd';
import { connect } from 'dva';
import 'codemirror/lib/codemirror.css';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/duotone-light.css';

function ModalRealtimeConfig(props) {
  const { content, visible } = props;
  const [currentFile, setCurrentFile] = useState(null);
  const [fileNameSelected, setFileNameSelected] = useState(null);

  useEffect(() => {
    if (visible) {
      if (content) {
        setCurrentFile(props.content[0]);
        setFileNameSelected(props.content[0]?.file_name);
      } else {
        setCurrentFile(null);
        setFileNameSelected(null);
      }
    }
  }, [visible, content]);

  return (
    <Modal
      visible={props.visible}
      width={800}
      title={'实时配置'}
      footer={null}
      onCancel={() => {
        props.dispatch({
          type: 'config/showModalInstanceConfig',
          payload: false,
        });
      }}
    >
      <Spin spinning={props.loading} tip={'正在加载'}>
        <Form.Item label={'文件'}>
          <Select
            value={fileNameSelected}
            onChange={(fileName) => {
              setFileNameSelected(fileName);
              props.content.map((item) => {
                if (item.file_name === fileName) {
                  setCurrentFile(item);
                }
              });
            }}
          >
            {(props.content || []).map((item) => (
              <Select.Option key={item.file_name} value={item.file_name}>
                {item.file_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div>
          {currentFile && currentFile.content && (
            <CodeMirror
              value={currentFile?.content}
              options={{
                mode: 'toml',
                theme: 'duotone-light',
                lineNumbers: true,
              }}
            />
          )}
        </div>

        {currentFile && currentFile.error && (
          <div>
            <Tag color={'error'}>error</Tag> {currentFile.error}
          </div>
        )}
      </Spin>
    </Modal>
  );
}

const mapStateToProps = ({ config }) => {
  return {
    visible: config.visibleModalRealtimeConfig,
    loading: config.instanceConfigContentLoading,
    content: config.instanceConfigContent,
  };
};

export default connect(mapStateToProps)(ModalRealtimeConfig);
