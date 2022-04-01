import { Modal, Select, Table } from 'antd';
import { fileKeyDiff } from '../service';

export default class Normal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: [],
      rafeCid: 0,
    };
  }

  //文件对比按钮响应，更新rafeCid
  componentWillUpdate(nextProps) {
    if (this.props.show || !nextProps.show) return;
    const { appConfigList = [], originCid } = this.props;
    const appInfo = appConfigList[0] || {};
    const configList = appInfo.configs || [];
    if (configList.length < 2) {
      return;
    }
    let initId = 0;
    //查看live环境是否存在config-live.toml
    for (let item of configList) {
      if (item.env == 'live' && item.file_name == 'config-live.toml') {
        initId = item.id;
        break;
      }
    }
    if (initId == 0) {
      initId = originCid != configList[0].id || 0 ? configList[0].id || 0 : configList[1].id || 0;
    }
    this.updateKeys(originCid, initId);
  }

  handleChange = (id) => {
    this.setState({
      rafeCid: id,
    });
    const { originCid = 0 } = this.props;
    this.updateKeys(originCid, id);
  };

  handleCancel = (_) => {
    this.setState({
      keys: [],
    });
    this.props.cancel();
  };

  updateKeys = (oid, rid) => {
    fileKeyDiff({
      origin_cid: oid,
      rafe_cid: rid,
    }).then((res) => {
      this.setState({
        keys: res.data,
        rafeCid: rid,
      });
    });
  };

  render() {
    const { show, appConfigList = [] } = this.props;
    const { keys = [] } = this.state;
    const appInfo = appConfigList[0] || {};
    const configList = appInfo.configs || [];
    const columns = [
      {
        key: 'key',
        dataIndex: 'key',
        title: '键名',
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '差异',
        render(text, record) {
          if (text === 'new') {
            return (
              <span
                style={{
                  backgroundColor: 'green',
                  borderRadius: '5px',
                  padding: '5px',
                  color: 'white',
                }}
              >
                新增
              </span>
            );
          } else {
            return (
              <span
                style={{
                  backgroundColor: 'red',
                  borderRadius: '5px',
                  padding: '5px',
                  color: 'white',
                }}
              >
                缺失
              </span>
            );
          }
        },
      },
    ];
    return (
      <Modal
        title="配置文件对比"
        onCancel={this.handleCancel}
        onOk={this.handleCancel}
        destroyOnClose
        maskClosable
        visible={show}
      >
        <Select
          style={{ width: '100%' }}
          onChange={this.handleChange}
          value={this.state.rafeCid}
          notFoundContent={'文件列表为空'}
        >
          {configList.map(
            (item) =>
              item.id != this.props.originCid && (
                <Select.Option key={item.id} value={item.id}>
                  {item.file_name}
                </Select.Option>
              ),
          )}
        </Select>
        <div>
          {keys.length != 0 ? (
            <Table
              style={{ width: '100%' }}
              dataSource={keys}
              columns={columns}
              pagination={{
                pageSize: 20,
                hideOnSinglePage: true,
                size: 'small',
              }}
              size={'small'}
            />
          ) : (
            <p style={{ marginTop: '8px', marginLeft: '4px' }}>未选择文件或文件完全相同</p>
          )}
        </div>
      </Modal>
    );
  }
}
