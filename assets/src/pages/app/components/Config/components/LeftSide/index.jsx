import React, {useState} from 'react';
import styles from './index.less';
import {Menu} from "./components/Menu";
import {FileOutlined, OrderedListOutlined} from '@ant-design/icons'
import Files from "./components/Files";
import {connect} from 'dva'
import ModalCreate from "@/pages/app/components/Config/components/ModalCreate";

const MenuItems = [
  {
    icon: <FileOutlined/>,
    key: 'config-edit',
    label: '配置编辑'
  },
  {
    icon: <OrderedListOutlined/>,
    key: 'version',
    label: '历史版本'
  },
]

function LeftSide(props) {
  const {visibleModalCreate} = props
  const [activeMenuKey, setActiveMenuKey] = useState('config-edit')

  let renderMain = () => {
    switch (activeMenuKey) {
      case "config-edit":
        return <Files/>
      case 'version':
        return <div>version</div>
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
