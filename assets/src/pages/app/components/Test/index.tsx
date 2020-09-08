import React, {useEffect, useState} from 'react'
import styles from './index.less'
import {ConnectState} from "@/models/connect";
import {connect} from "dva";
import {Pipeline} from "@/models/testplatform/types";
import {Dispatch} from "@@/plugin-dva/connect";
import {Button, Empty, message, Skeleton} from "antd";
import {AppstoreOutlined} from '@ant-design/icons'
import Tasks from "@/pages/app/components/Test/Tasks";
import {ArrowLeftOutlined, FileAddOutlined} from "@ant-design/icons/lib";
import RunStatus from "@/pages/app/components/Test/RunStatus";
import ModalCreatePipeline from "@/pages/app/components/Test/ModalCreatePipeline";
import {useBoolean} from "ahooks";
import {createPipeline} from "@/services/testplatform";

interface TestProps {
  pipelines: Pipeline[],
  pipelinesLoading: boolean,
  dispatch: Dispatch,
  appName: string
  zoneCode: string
  env: string
}

function Test(props: TestProps) {
  const {dispatch, pipelines, pipelinesLoading, appName, env, zoneCode} = props
  const [pipeline, setPipeline] = useState<Pipeline | null>(null)
  const [visibleModalCreate, visibleModalCreateAction] = useBoolean(false)

  const fetchPipelines = () => dispatch({
    type: 'testPlatform/fetchPipelines',
    payload: {
      app_name: appName,
      env: env,
      zone_code: zoneCode,
    }
  })

  useEffect(() => {
    fetchPipelines()
  }, [appName, env, zoneCode])

  return <div className={styles.Test}>

    {/*未选择 pipeline*/}
    {!pipeline && <div style={{flex: '1 1 auto'}}>

      <div style={{
        display: "grid",
        gridTemplateColumns: "auto 150px"
      }}>
        <h4>Pipeline</h4>
        <Button
          icon={<FileAddOutlined/>}
          onClick={() => visibleModalCreateAction.setTrue()}
        >新建 Pipeline</Button>
      </div>

      {!pipelinesLoading && <ul className={styles.Pipelines}>
        {pipelines.map(item => <li key={item.id} onClick={() => {
          setPipeline(item)
        }} className={styles.PipelineItem}>
          <div className={styles.pipelineIcon}>
            <AppstoreOutlined/>
          </div>
          <div className={styles.pipelineName}>{item.name}</div>
          <RunStatus className={styles.pipelineStatus} status={item.status}/>
          <div className={styles.runCount}>
            <div>{item.run_count}</div>
            <div>执行次数</div>
          </div>
        </li>)}
      </ul>}

      {pipelinesLoading && <div>
        <Skeleton active round/>
        <Skeleton active round/>
      </div>}

      {!pipelinesLoading && (!pipelines || !pipelines.length) && <Empty
        description={"暂无Pipeline"}
      />}
    </div>}

    {pipeline && <div style={{flex: '1 1 auto'}}>
      <div>
        <Button
          style={{padding: '4px 0'}}
          icon={<ArrowLeftOutlined/>}
          onClick={() => setPipeline(null)} type={"link"}>
          返回 Pipeline 列表
        </Button>
      </div>

      <Tasks
        onDelete={() => {
          setPipeline(null)
          fetchPipelines()
        }}
        appName={appName}
        zoneCode={zoneCode}
        env={env}
        onUpdate={() => {
          setPipeline(null)
          fetchPipelines()
        }}
        pipeline={pipeline}
      />
    </div>}

    <ModalCreatePipeline
      visible={visibleModalCreate}
      onCancel={() => visibleModalCreateAction.setFalse()}
      onFinish={(fields) => {
        fields = {
          ...fields,
          grpc_test_cases: fields.grpc_test_cases?.map((item: any) => ({
            service: item.testcase[0],
            method: item.testcase[1],
            testcase: item.testcase[2]
          })) || []
        }

        createPipeline(fields).then(r => {
          if (r.code === 14000) return

          if (r.code != 0) {
            message.error("创建失败 " + r.msg)
            return
          }

          message.success("创建成功")
          fetchPipelines()
          visibleModalCreateAction.setFalse()
        })
      }}
      appName={appName}
      env={env}
      zoneCode={zoneCode}
    />
  </div>
}

const mapStateToProps = ({testPlatform}: ConnectState) => {
  return {
    pipelines: testPlatform.pipelines,
    pipelinesLoading: testPlatform.pipelinesLoading,
  }
}

export default connect(mapStateToProps)(Test)
