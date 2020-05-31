import React from "react";
import { Table, Modal } from "antd";
import moment from "moment";
import { ReactGhLikeDiff } from "react-gh-like-diff";
// import "react-gh-like-diff/dist/diff2html.min.css";
import styles  from "../style/code.less";

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  render() {
    const { oldCode = "", newCode = "", show } = this.props;

    return (
      <Modal
        title="预览变更"
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
        width={1400}
      >
        <div style={{ overflow: "auto" }}>
          <ReactGhLikeDiff
            options={{
              originalFileName: "原始内容",
              updatedFileName: "更新内容"
            }}
            style={{
              width: "1400px",
              wordWrap: "break-word",
              wordBreak: "break-all"
            }}
            past={oldCode}
            current={newCode}
          />
        </div>
      </Modal>
    );
  }
}
