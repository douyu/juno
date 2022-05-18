import { Button, Col, Row } from 'antd';
import React from 'react';
import style from './index.less';
const Help = (props) => {
  return (
    <Row className={style.help}>
      <Col span={4}>
        <Button>
          <a href="https://github.com/douyu/juno/wsd/penaten/juno-go/issues/new" target={'_blank'}>
            使用问题点这里提issue{' '}
          </a>
        </Button>
      </Col>
    </Row>
  );
};

export default Help;
