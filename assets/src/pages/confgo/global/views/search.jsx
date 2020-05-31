import React from 'react';
import { Form, Radio, Select, Row, Col, Input } from 'antd'
import StandardFormRow from '../components/StandardFormRow'
import { Fragment } from 'react'

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 }
  }
};
const EnvOptions = [{
  key: 'dev',
  label: 'dev'
}, {
  key: 'live',
  label: 'live'
}, {
  key: 'pre',
  label: 'pre'
}, {
  key: 'stress',
  label: 'stress'
}, {
  key: 'gray',
  label: 'gray'
}, {
  key: 'prod',
  label: 'prod'
}];


const IdcCodeDevOptions = [{
  key: 'HB-WHYL',
  label: '武汉银联'
}];

const IdcCodeProdOptions = [{
  key: 'HB-WHYL',
  label: '武汉银联'
}, {
  key: 'BJ-CP-WG',
  label: '北京昌平'
},{
  key: 'TENCENT-SHANGHAI-4',
  label: '腾讯云-华东地区(上海4区)'
}, {
  key: 'TENCENT-AP-SHANGHAI',
  label: '腾讯云-华东地区(上海)[历史数据可用]'
}, {
  key: 'BJ-BG',
  label: '北京海淀'
}, {
  key: 'BJ-ZW-10',
  label: '北京兆维'
}, {
  key: 'BJ-YZ',
  label: '北京亦庄'
}, {
  key: 'ALIYUN-HB2-C',
  label: '华北阿里云C区'
}, {
  key: 'ALIYUN-HB2-D',
  label: '华北阿里云D区'
}, {
  key: 'ALIYUN-HB2-E',
  label: '华北阿里云E区'
}, {
  key: 'ALIYUN-HB2-F',
  label: '华北阿里云F区'
}, {
  key: 'ALIYUN-HB2-G',
  label: '华北阿里云G区'
}, {
  key: 'ALIYUN-HN',
  label: '华南阿里云'
}, {
  key: 'ALIYUN-SZ',
  label: '深圳阿里云'
}, {
  key: 'ALIYUN-HD',
  label: '华东阿里云'
}];

const TypeOptions = [{
  key: 'redis',
  label: 'redis'
}, {
  key: 'mysql',
  label: 'mysql'
}, {
  key: 'grpc',
  label: 'grpc'
}, {
  key: 'rocketmq',
  label: 'rocketmq'
}, {
  key: 'etcd',
  label: 'etcd'
}, {
  key: 'dyrpc',
  label: 'dyrpc'
}, {
  key: 'mongo',
  label: 'mongo'
}, {
  key: 'key-value',
  label: 'key-value',
}, {
  key: 'other',
  label: '其他',
}];

@Form.create({
  onValuesChange(props, _, values) {
    console.log("values", values);
    // if (values.env === "prod"){
    //   values.idc_code = IdcCodeProdOptions[0].key
    // }else{
    //   values.idc_code = IdcCodeDevOptions[0].key
    // }
    props.onChange(values)
  }
})
export default class View extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      value: '',
      opt: IdcCodeDevOptions,
    }
  }

  handleSearchInput = ({ target }) => {
    const { onChange, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { value } = this.state;
      values.value = value;
      values.name = target.value;
      onChange(values);
    })
  };

  handleSearchValueInput = ({ target }) => {
    const { onChange, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { name } = this.state;
      values.name = name;
      values.value = target.value;
      onChange(values);
    })
  };

  envSelect=(value)=>{
    if (value === "prod" || value==="gray"){
      this.setState({
        opt: IdcCodeProdOptions,
      })
    } else{
      this.setState({
        opt: IdcCodeDevOptions,
      })
    }
  };

  render() {
    const { params = {} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {opt} = this.state;
    return <Fragment>
      <Form layout="inline">
          <FormItem>
            {getFieldDecorator('env', {
              initialValue: params.env || EnvOptions[0].key
            })(
              <Select style={{width:"100px"}} onSelect={this.envSelect}>
                {EnvOptions.map(el => (<Option key={el.key} value={el.key}>{el.label}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('idc_code', {
              initialValue: params.idc_code || opt[0].key
            })(
              <Select style={{width:"200px"}}>
                {opt.map(el => (<Option key={el.key} value={el.key}>{el.label}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('type', {
              initialValue: params.type || TypeOptions[0].key
            })(
              <Select style={{width:"200px"}}>
                {TypeOptions.map(el => (<Option key={el.key} value={el.key}>{el.label}</Option>))}
              </Select>
            )}
          </FormItem>
          <Row gutter={16}>
            <Col xl={8} lg={10} md={12} sm={24} xs={24}>
              <FormItem {...formItemLayout} label={'资源名称'}>
                <Input placeholder="输入资源名称"
                  ref={"name"}
                  value={this.state.name}
                  onChange={e => {
                    this.setState({
                      name: e.target.value,
                    })
                  }}
                  defaultValue={params.name}
                  onPressEnter={this.handleSearchInput}
                  style={{ marginRight: '16px', display: 'inline' }}
                />
              </FormItem>
            </Col>
            <Col xl={8} lg={10} md={12} sm={24} xs={24}>
              <FormItem {...formItemLayout} label={'资源值'}>
                <Input placeholder="输入资源值"
                  ref={"value"}
                  value={this.state.value}
                  onChange={e => {
                    this.setState({
                      value: e.target.value,
                    })
                  }}
                  defaultValue={params.value}
                  onPressEnter={this.handleSearchValueInput}
                  style={{ display: 'inline' }}
                />
              </FormItem>
            </Col>
          </Row>
      </Form>
    </Fragment>
  }
}