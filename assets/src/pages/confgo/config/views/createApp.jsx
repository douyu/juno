import React from "react";
import { Modal, Select } from "antd";

const Option = Select.Option;

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  render() {
    const apps = [];

    return (
      <Modal
        title="导入应用和配置文件"
        visible={this.state.showAddProject}
        onCancel={() => {
          this.setState({
            showAddProject: false
          });
        }}
        footer={null}
        destroyOnClose
      >
        <div>
          <Select
            showSearch
            style={{ width: "80%", marginLeft: "8px" }}
            placeholder="选择应用"
            value={this.state.appName}
            onChange={this.changeApp}
            onSelect={e => {}}
            allowClear
          >
            {apps.map((v, i) => {
              return (
                <Option key={v.aid} value={v.app_name}>
                  {v.app_name}
                </Option>
              );
            })}
          </Select>
        </div>
      </Modal>
    );
  }
}
