import React from "react";
import {JobType} from "@/models/testplatform/types";
import styles from './StepLogs.less'
import {Card, Col, Collapse, Divider, List, Row, Statistic, Tabs} from "antd";
import RunStatus from "@/pages/app/components/Test/RunStatus";

interface StepLogsProps {
  logs: string
  jobType: JobType
}

const VisualLogComponents = {
  [JobType.CodeCheck]: VisualCodeCheck,
  [JobType.UnitTest]: VisualUnitTest
}

export function StepLogs(props: StepLogsProps) {
  let VisualComponent = VisualLogComponents[props.jobType]

  if (VisualComponent) {
    return <VisualComponent {...props}/>
  }

  return <div>
    <div className={styles.logs}>
      <pre>{props.logs}</pre>
    </div>
  </div>
}

function VisualCodeCheck(props: { logs: string }) {
  const {logs} = props

  const parseLogs = (logs: string) => {
    let lines = logs.split("\n")
    let result: any[] = []
    lines.forEach(line => {
      try {
        let obj = JSON.parse(line)
        if (obj.progress_log) return
        result.push(obj)
      } catch (e) {
      }
    })

    return result
  }

  const logsParsed = parseLogs(logs)
  return <div>
    <Tabs>
      <Tabs.TabPane key={"result"} tab={"结果"}>
        <List
          dataSource={logsParsed}
          renderItem={(item, idx) => {
            return <List.Item key={idx}>
              <div className={styles.codeCheckItem}>
                <div>
                  <div><a href={item.Link} target={"_blank"}>{item.Category}</a> {item.Text}</div>
                  <div>At {item.Position.Filename}:{item.Position.Line}:{item.Position.Column}</div>
                </div>

                <div className={styles.lineText}>
                  <div className={styles.lineNumber}>{item.Position.Line}</div>
                  <pre>{item.LineText}</pre>
                </div>
              </div>
            </List.Item>
          }}
          pagination={{}}
        />
      </Tabs.TabPane>
      <Tabs.TabPane key={"log"} tab={"日志"}>
        <div className={styles.logs}>
          <pre>{logs}</pre>
        </div>
      </Tabs.TabPane>
    </Tabs>
  </div>
}

function VisualUnitTest(props: { logs: string }) {
  const {logs} = props

  const logParser = (logs: string): any[] => {
    let packTestMap = {}
    let lines = logs.split('\n')

    lines.forEach(line => {
      try {
        let obj = JSON.parse(line) || {}
        if (obj.progress_log) return
        let testName = obj.Test, packageName = obj.Package, action = obj.Action
        if (!packageName || !action) return
        if (action === 'skip') {
          delete packTestMap[packageName]
          return
        }

        let goPackage = packTestMap[packageName] || {tests: {}, output: '', status: '', elapsed: 0}

        if (!testName) { //package
          obj.Elapsed && (goPackage.elapsed = obj.Elapsed)
          switch (action) {
            case 'output':
              goPackage.output += obj.Output
              goPackage.status = 'running'
              break
            case 'run':
              goPackage.status = 'running'
              break
            case 'fail':
              goPackage.status = 'fail'
              break
            case 'pass':
              goPackage.status = 'pass'
          }
        } else { // case
          let test = goPackage.tests[testName] || {output: ''}
          test.elapsed = obj.Elapsed
          switch (obj.Action) {
            case 'output':
              test.output += obj.Output
              test.status = 'running'
              break
            case 'run':
              test.status = 'running'
              break
            case 'fail':
              test.status = 'fail'
              break
            case 'pass':
              test.status = 'pass'
          }
          goPackage.tests[obj.Test] = test
        }

        packTestMap[obj.Package] = goPackage
      } catch (e) {
      }
    })

    let packs: any[] = [] // [ package: [tests] ]
    Object.keys(packTestMap).forEach(packName => {
      const {tests, status, output, elapsed} = packTestMap[packName]
      let pack = {
        package: packName,
        status,
        output,
        elapsed,
        tests: [] as any[]
      }

      Object.keys(tests).forEach(testName => {
        pack.tests.push({
          ...tests[testName],
          test: testName
        })
      })

      packs.push(pack)
    })

    return packs
  }

  const testResult = logParser(logs)
  let testCaseCount = 0, failedCount = 0, passCount = 0
  testResult.map(pack => {
    testCaseCount += pack.tests.length
    pack.tests.forEach((test: any) => {
      if (test.status === 'pass') {
        passCount += 1
      } else if (test.status === 'fail') {
        failedCount += 1
      }
    })
  })

  return <div>
    <Tabs>
      <Tabs.TabPane tab={"用例"} key={"testcase"}>
        <Row gutter={16} style={{marginBottom: '10px'}}>
          <Col span={8}>
            <Card>
              <Statistic title={"用例个数"} value={testCaseCount}/>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title={"失败个数"} value={failedCount}/>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title={"成功个数"} value={passCount}/>
            </Card>
          </Col>
        </Row>

        <Collapse accordion>
          {testResult.map((pack, idx) => {
            return <Collapse.Panel
              key={idx} header={"Package: " + pack.package}
              extra={<span>{pack.elapsed}s <Divider type={"vertical"}
                                                    style={{borderLeft: "1px solid #cecece"}}/> {pack.tests.length}个用例</span>}
            >
              <div>用例</div>
              <List
                size={"small"}
                dataSource={pack.tests || []}
                renderItem={(test: any, idx) => <List.Item key={idx}>
                  <Collapse style={{width: '100%'}}>
                    <Collapse.Panel
                      key={idx}
                      header={<span>
                        Test: {test.test}
                      </span>}
                      extra={<div>
                        <RunStatus status={test.status} className={styles.testCaseStatus}/>
                      </div>}
                    >
                      <div>
                        <pre>{test.output}</pre>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </List.Item>}
              />
              <h3>日志</h3>
              <div>
                <pre>{pack.output}</pre>
              </div>
            </Collapse.Panel>
          })}
        </Collapse>
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Log"} key={"log"}>
        <div className={styles.logs}>
          <pre>{logs}</pre>
        </div>
      </Tabs.TabPane>
    </Tabs>

  </div>
}
