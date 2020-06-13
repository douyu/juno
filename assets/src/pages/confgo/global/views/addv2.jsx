import react from 'react';
import {Form,Modal,Input,Select,Card,Row,Col,Radio,Button} from 'antd';

@Form.create()
export default class View extends react.Component{
  constructor(props){
    super(props);
    this.state = {
      resourceType:'redis', //资源类型
      masterInfo:'master', //主从类型
    }
  }

  onChangeType = (e)=>{
    this.setState({
      resourceType:e.target.value
    })
  };

  onChangeMaster = (e)=>{
    this.setState({
      masterInfo:e.target.value
    })
  };

  render() {
    const {masterInfo} = this.state;
    const { getFieldDecorator } = this.props.form;

    const resourceData = ['redis','mysql','mongodb','grpc','dyrpc','rocketmq','k-v'];

    const envs = ['dev','live','pre','stress','gray','prod'];
    //资源类型
    //redis 环境 主从 名称
    //mysql 环境 主从 名称
    //mongodb 环境 主从 名称

    //dyrpc 环境
    //grpc 环境

    //rocketmq 环境
    //key-value 环境

    return <div>
      <Card title={'基本信息'}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Row>
            <Col span={10}>
              <Form.Item label={'资源类型'}>
                <Radio.Group onChange={this.onChangeType}>
                  {
                    resourceData.map(v=>{
                      return <Radio value={v}>{v}</Radio>
                    })
                  }
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={'选择环境'}>
                {getFieldDecorator('env', {
                  rules: [{ required: true, message: '选择环境' }],
                })(
                  <Select>
                    {
                      envs.map(v=>{
                        return <Select.Option value={v}>{v}</Select.Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title={`Redis资源`}>
        <Form.Item label={'redis主从'}>
          {getFieldDecorator('masterInfo',{
            rules: [{ required: true, message: '请填写主从' }],
          })
          (
            <Radio.Group onChange={this.onChangeMaster}>
              <Radio value={'master'}>{'主库'}</Radio>
              <Radio value={'slave'}>{'从库'}</Radio>
            </Radio.Group>
          )
          }
        </Form.Item>
        <Form.Item label={'redis名称'}>
          {getFieldDecorator('name',{
            rules: [{ required: true, message: '请填写名称' }],
          })
          (
            <Input placeholder={'资源名称,业务用途相关'}/>
          )
          }
        </Form.Item>
        {
          this.state.masterInfo === 'master' &&
          <Form.Item label={'redis主库的DSN值'}>
            {getFieldDecorator('name',{
              rules: [{ required: true, message: '请填写redis实例地址' }],
            })
            (
              <Input placeholder={'redis实例地址'}/>
            )
            }
          </Form.Item>
        }
        {
          this.state.masterInfo === 'slave' &&
          <div>
            <Form.Item label={'redis从库的DSN值'}>
              {getFieldDecorator('name',{
                rules: [{ required: true, message: '请填写redis实例地址' }],
              })
              (
                <Input placeholder={'redis实例地址'}/>
              )
              }
            </Form.Item>
            <Form.Item>
              <Button>添加从库</Button>
            </Form.Item>
          </div>
        }
      </Card>
    </div>
  }
}