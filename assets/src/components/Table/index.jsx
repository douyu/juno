import {  Table } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

class StandardTable extends Component {
  constructor(props) {
    super(props);
  }

  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };


  render() {
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;
    return (
      <div className={styles.standardTable}>
        <Table
          key={Date.now()}
          rowKey={rowKey || 'id'}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
