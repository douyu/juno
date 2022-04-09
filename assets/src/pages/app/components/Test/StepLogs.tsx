import React from 'react';
import { JobType } from '@/models/testplatform/types';
import styles from './StepLogs.less';
import { Card, Col, Collapse, Descriptions, Divider, List, Row, Statistic, Tabs } from 'antd';
import RunStatus from '@/pages/app/components/Test/RunStatus';
import MonacoEditor from 'react-monaco-editor';
import PrettyJsonView from 'pretty-json-view';
import 'pretty-json-view/style.css';

interface StepLogsProps {
  logs: string;
  jobType: JobType;
}

const VisualLogComponents = {
  [JobType.CodeCheck]: VisualCodeCheck,
  [JobType.UnitTest]: VisualUnitTest,
  [JobType.HttpTest]: VisualHttpTestLog,
  [JobType.GrpcTest]: VisualGrpcTestLog,
};

function LogView(props: { logs: string }) {
  return (
    <MonacoEditor
      value={props.logs}
      theme={'vs'}
      height={'500px'}
      width={'100%'}
      options={{
        readOnly: true,
        wordWrap: 'on',
      }}
    />
  );
}

export function StepLogs(props: StepLogsProps) {
  let VisualComponent = VisualLogComponents[props.jobType];

  if (VisualComponent) {
    return <VisualComponent {...props} />;
  }

  return (
    <div>
      <LogView logs={props.logs} />
    </div>
  );
}

function VisualCodeCheck(props: { logs: string }) {
  const { logs } = props;

  const parseLogs = (logs: string) => {
    let lines = logs.split('\n');
    let result: any[] = [];
    lines.forEach((line) => {
      try {
        let obj = JSON.parse(line);
        if (obj.progress_log) return;
        result.push(obj);
      } catch (e) {}
    });

    return result;
  };

  const logsParsed = parseLogs(logs);
  return (
    <div>
      <Tabs>
        <Tabs.TabPane key={'result'} tab={'结果'}>
          <List
            dataSource={logsParsed}
            renderItem={(item, idx) => {
              return (
                <List.Item key={idx}>
                  <div className={styles.codeCheckItem}>
                    <div>
                      <div>
                        <a href={item.Link} target={'_blank'}>
                          {item.Category}
                        </a>{' '}
                        {item.Text}
                      </div>
                      <div>
                        At {item.Position.Filename}:{item.Position.Line}:{item.Position.Column}
                      </div>
                    </div>

                    <div className={styles.lineText}>
                      <div className={styles.lineNumber}>{item.Position.Line}</div>
                      <pre>{item.LineText}</pre>
                    </div>
                  </div>
                </List.Item>
              );
            }}
            pagination={{}}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key={'log'} tab={'日志'}>
          <LogView logs={logs} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

function VisualUnitTest(props: { logs: string }) {
  const { logs } = props;

  const logParser = (logs: string): any[] => {
    let packTestMap = {};
    let lines = logs.split('\n');

    lines.forEach((line) => {
      try {
        let obj = JSON.parse(line) || {};
        if (obj.progress_log) return;
        let testName = obj.Test,
          packageName = obj.Package,
          action = obj.Action;
        if (!packageName || !action) return;
        if (action === 'skip') {
          delete packTestMap[packageName];
          return;
        }

        let goPackage = packTestMap[packageName] || {
          tests: {},
          output: '',
          status: '',
          elapsed: 0,
        };

        if (!testName) {
          //package
          obj.Elapsed && (goPackage.elapsed = obj.Elapsed);
          switch (action) {
            case 'output':
              goPackage.output += obj.Output;
              goPackage.status = 'running';
              break;
            case 'run':
              goPackage.status = 'running';
              break;
            case 'fail':
              goPackage.status = 'fail';
              break;
            case 'pass':
              goPackage.status = 'pass';
          }
        } else {
          // case
          let test = goPackage.tests[testName] || { output: '' };
          test.elapsed = obj.Elapsed;
          switch (obj.Action) {
            case 'output':
              test.output += obj.Output;
              test.status = 'running';
              break;
            case 'run':
              test.status = 'running';
              break;
            case 'fail':
              test.status = 'fail';
              break;
            case 'pass':
              test.status = 'pass';
          }
          goPackage.tests[obj.Test] = test;
        }

        packTestMap[obj.Package] = goPackage;
      } catch (e) {}
    });

    let packs: any[] = []; // [ package: [tests] ]
    Object.keys(packTestMap).forEach((packName) => {
      const { tests, status, output, elapsed } = packTestMap[packName];
      let pack = {
        package: packName,
        status,
        output,
        elapsed,
        tests: [] as any[],
      };

      Object.keys(tests).forEach((testName) => {
        pack.tests.push({
          ...tests[testName],
          test: testName,
        });
      });

      packs.push(pack);
    });

    return packs;
  };

  const testResult = logParser(logs);
  let testCaseCount = 0,
    failedCount = 0,
    passCount = 0;
  testResult.map((pack) => {
    testCaseCount += pack.tests.length;
    pack.tests.forEach((test: any) => {
      if (test.status === 'pass') {
        passCount += 1;
      } else if (test.status === 'fail') {
        failedCount += 1;
      }
    });
  });

  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab={'用例'} key={'testcase'}>
          <Row gutter={16} style={{ marginBottom: '10px' }}>
            <Col span={8}>
              <Card>
                <Statistic title={'用例个数'} value={testCaseCount} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title={'失败个数'} value={failedCount} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title={'成功个数'} value={passCount} />
              </Card>
            </Col>
          </Row>

          <Collapse accordion>
            {testResult.map((pack, idx) => {
              return (
                <Collapse.Panel
                  key={idx}
                  header={'Package: ' + pack.package}
                  extra={
                    <span>
                      {pack.elapsed}s{' '}
                      <Divider type={'vertical'} style={{ borderLeft: '1px solid #cecece' }} />{' '}
                      {pack.tests.length}个用例
                    </span>
                  }
                >
                  <div>用例</div>
                  <List
                    size={'small'}
                    dataSource={pack.tests || []}
                    renderItem={(test: any, idx) => (
                      <List.Item key={idx}>
                        <Collapse style={{ width: '100%' }}>
                          <Collapse.Panel
                            key={idx}
                            header={<span>Test: {test.test}</span>}
                            extra={
                              <div>
                                <RunStatus status={test.status} className={styles.testCaseStatus} />
                              </div>
                            }
                          >
                            <div>
                              <pre>{test.output}</pre>
                            </div>
                          </Collapse.Panel>
                        </Collapse>
                      </List.Item>
                    )}
                  />
                  <h3>日志</h3>
                  <div>
                    <pre>{pack.output}</pre>
                  </div>
                </Collapse.Panel>
              );
            })}
          </Collapse>
        </Tabs.TabPane>
        <Tabs.TabPane tab={'Log'} key={'log'}>
          <LogView logs={logs} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

function VisualHttpTestLog(props: { logs: string }) {
  const { logs } = props;
  let tests: any[] = [];
  let testMap = {};

  {
    const lines = logs.split('\n');
    lines.map((line) => {
      try {
        let obj = JSON.parse(line);
        if (obj.progress_log) return;

        let testID = obj.test_id;
        let test = testMap[testID] || { id: testID };
        switch (obj.action) {
          case 'output':
            test.result = obj.result;
            break;
          case 'fail':
            test.status = 'fail';
            break;
          case 'pass':
            test.status = 'pass';
            break;
        }
        test.name = obj.test_case_name;
        testMap[testID] = test;
      } catch (e) {}
    });

    Object.keys(testMap).forEach((key) => {
      tests.push(testMap[key]);
    });

    console.log('http tests', tests);
  }

  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab={'结果'} key={'result'}>
          <Collapse>
            {tests.map((test) => {
              return (
                <Collapse.Panel key={test.id} header={test.name} extra={test.status}>
                  <Tabs>
                    <Tabs.TabPane tab={'Headers'} key={'headers'}>
                      <Descriptions bordered column={1} size={'small'}>
                        {test.result?.raw_response?.headers &&
                          Object.keys(test.result?.raw_response?.headers).map((key) => {
                            let val = test.result.raw_response.headers[key];
                            return (
                              <Descriptions.Item key={key} label={key}>
                                {val.join('; ')}
                              </Descriptions.Item>
                            );
                          })}
                      </Descriptions>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={'Body'} key={'body'}>
                      <MonacoEditor
                        value={test.result.raw_response.body}
                        theme={'vs'}
                        height={'500px'}
                        width={'100%'}
                        options={{
                          readOnly: true,
                        }}
                      />
                    </Tabs.TabPane>
                  </Tabs>
                </Collapse.Panel>
              );
            })}
          </Collapse>
        </Tabs.TabPane>
        <Tabs.TabPane tab={'Log'} key={'log'}>
          <LogView logs={logs} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

function VisualGrpcTestLog(props: { logs: string }) {
  const { logs } = props;
  let tests: any[] = [];

  {
    let lines = logs.split('\n');
    lines.forEach((line) => {
      line = line.trim();
      if (!line.length) return;

      try {
        let test = JSON.parse(line);
        if (test.progress_log === true) return;

        tests.push(test);
      } catch (e) {}
    });
  }

  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab={'结果'} key={'result'}>
          <Collapse defaultActiveKey={0}>
            {tests.map((test, index) => (
              <Collapse.Panel header={<span>{test.test}</span>} key={index}>
                <Descriptions bordered>
                  <Descriptions.Item label={'Package'}>{test.package}</Descriptions.Item>
                  <Descriptions.Item label={'Service'}>{test.service}</Descriptions.Item>
                  <Descriptions.Item label={'Method'}>{test.method}</Descriptions.Item>

                  <Descriptions.Item span={24} label={'Input'}>
                    <PrettyJsonView data={test.input} />
                  </Descriptions.Item>

                  <Descriptions.Item span={24} label={'Output'}>
                    <PrettyJsonView data={test.raw_response || {}} />
                  </Descriptions.Item>
                </Descriptions>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Tabs.TabPane>

        <Tabs.TabPane tab={'Log'} key={'log'}>
          <LogView logs={logs} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
