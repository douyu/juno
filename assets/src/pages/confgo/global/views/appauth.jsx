import { Select, Table, Modal, Button, Col, message } from 'antd'
import React from 'react'
import { connect } from 'dva';
import { delResourceAssign, addResourceAssign } from "../service";

@connect(({ configResource, }) => ({
    authList: configResource.authList,
    options: configResource.options,
    appList: configResource.appList,
}))

export default class NormalForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            app_id: '',
        };
    }

    delAssignApp = () => {
        const { app_id } = this.state;
        const { res_id } = this.props;
        delResourceAssign({ res_id, app_id }).then(rs => {
            if (rs.code === 0) {
                message.success("删除成功");
                this.updateAuthList();
            } else {
                message.error("删除失败");
            }
        });
    }

    addAssignApp = (app_name) => {
        const { appList } = this.props;
        let app;
        //根据app_name找到app
        for (let item of appList) {
            if (item.app_name === app_name) {
                app = item;
                break;
            }
        }
        const { res_id } = this.props;
        const app_id = app.aid;
        const list = this.props.authList;
        for (let i of list) {
            if (app_id === i.aid) {
                message.info("已存在，请勿重复添加");
                return;
            }
        }
        addResourceAssign({ datas: [{ res_id: res_id, app_name: app.app_name, app_id: app.aid }] }).then(rs => {
            if (rs.code === 0) {
                message.success("添加成功");
                this.updateAuthList();
            } else {
                message.error("添加失败");
            }
        });
    }

    updateAuthList = () => {
        const { res_id } = this.props;
        if (res_id === 0) {
            return;
        }
        this.props.dispatch({
            type: 'configResource/queryAuthList',
            payload: { res_id }
        });
    }

    render() {
        const that = this;
        const { show, authList = [], options = [], } = this.props;
        const { } = this.state;
        const cols = [{
            key: 'app_name',
            dataIndex: 'app_name',
            title: '应用名',
        }, {
            key: 'op',
            dataIndex: 'op',
            title: '操作',
            render(t, r) {
                return <div><Button onClick={(e) => {
                    that.setState({
                        app_id: r.aid * 1,
                    }, () => {
                        that.delAssignApp();
                    })
                }}>删除</Button></div>
            }
        }];
        return (
            <Modal
                title="应用列表"
                visible={show}
                maskClosable
                onCancel={this.props.cancel}
                footer={null}
                destroyOnClose>
                <Col style={{ backgroundColor: `white` }}>
                    <Select
                        showSearch
                        style={{ width: '100%', marginBottom: '10px' }}
                        placeholder="选择应用添加授权"
                        onSelect={(e) => {
                            this.addAssignApp(e);
                        }}
                        allowClear>
                        {options.map((v) => {
                            return <Select.Option key={v.app_name} value={v.app_name}>
                                {v.app_name}</Select.Option>;
                        })}
                    </Select>
                </Col>
                <Table dataSource={authList} columns={cols} size="small" pagination={{ pageSize: 13, }} />
            </Modal>
        );
    }
}    