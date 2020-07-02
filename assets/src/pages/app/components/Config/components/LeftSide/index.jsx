import React, {useState} from 'react';
import styles from './index.less';
import {Menu} from "./components/Menu";
import {FileOutlined, CloudServerOutlined} from '@ant-design/icons'
import Files from "./components/Files";
import {connect} from 'dva'
import ModalCreate from "@/pages/app/components/Config/components/ModalCreate";
import Publish from "@/pages/app/components/Config/components/LeftSide/components/Publish";

const MenuItems = [
  {
    icon: <FileOutlined/>,
    key: 'config-edit',
    label: '配置编辑'
  },
  {
    icon: <CloudServerOutlined/>,
    key: 'publish',
    label: '版本发布'
  },
]

function LeftSide(props) {
  const {visibleModalCreate} = props
  const [activeMenuKey, setActiveMenuKey] = useState('config-edit')

  let renderMain = () => {
    switch (activeMenuKey) {
      case "config-edit":
        return <Files/>
      case 'publish':
        return <Publish/>
    }
  }

  return (
    <div className={styles.leftSide}>
      <Menu
        menu={MenuItems}
        activeKey={activeMenuKey}
        onChange={setActiveMenuKey}
      />
      <div className={styles.main}>
        {renderMain()}
      </div>

      <ModalCreate
        onCancel={() => props.showCreateModal(false)}
        visible={visibleModalCreate}
      />
    </div>
  );
}

const mapStateToProps = ({config}) => {
  return {
    configList: config.configList,
    visibleModalCreate: config.visibleModalCreate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showCreateModal: visible => dispatch({type: 'config/showCreateModal', payload: visible})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftSide)
