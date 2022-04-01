import React from 'react';
import { Button, Tree, message, Icon, Modal, Empty, Spin } from 'antd';
import RequestItem from './RequestItem';
import styles from './CollectionsTab.less';
import NewCollectionModal from './NewCollectionModal';
import NewTestCaseModal from './NewTestCaseModal';
import {
  createCollection,
  createRequest,
  deleteCollection,
  deleteTestCase,
  getFolderTree,
} from '@/services/httptest';
import RightMenu from './RightMenu';
import { DeleteOutlined, FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import ReactScrollBar from 'react-scrollbar';

const EventTargetCollection = 'collection',
  EventTargetTestCase = 'testcase';
const EventTypeDelete = 'delete',
  EventTypeNewTestCase = 'new-testcase',
  EventTypeNewCollection = 'new-collection';

@connect(({ HttpDebug }) => {
  return {
    collections: HttpDebug.collections,
    collectionsLoading: HttpDebug.collectionsLoading,
  };
})
export default class CollectionsTab extends React.Component {
  state = {
    modalNewFolderVisible: false,
    modelNewFolderParentID: 0,
    modalNewRequestVisible: false,
    modalNewRequestFolderID: 0,
    // DEPRECATED
    folderTree: [],
    collections: [],
    rightMenuVisible: false,
    rightMenuItems: [],
    rightMenuState: null,
    rightMenuPosition: {
      x: 0,
      y: 0,
    },
  };

  onMenuClick = (key, state) => {
    const { dispatch } = this.props;
    const { collectionID } = state;
    switch (key) {
      case EventTypeDelete:
        this.onDelete(state.type, state.id);
        break;
      case EventTypeNewCollection:
        dispatch({
          type: 'HttpDebug/showModalNewCollection',
          payload: true,
        });
        break;
      case EventTypeNewTestCase:
        dispatch({
          type: 'HttpDebug/showModalNewTestCase',
          payload: {
            visible: true,
            collectionID: collectionID,
          },
        });
        break;
    }
  };

  onDelete = (type, id) => {
    switch (type) {
      case EventTargetTestCase:
        Modal.confirm({
          title: '确认删除',
          content: '删除后不能恢复',
          onOk: () => {
            deleteTestCase(id).then((res) => {
              if (res.code !== 0) {
                message.error(res.msg);
              } else {
                message.success('删除成功');
              }

              this.loadCollections();
            });
          },
        });
        break;
      case EventTargetCollection:
        Modal.confirm({
          title: '确认删除',
          content: '删除后该文件夹下的所有内容将删除',
          onOk: () => {
            deleteCollection(id).then((res) => {
              if (res.code !== 0) {
                message.error(res.msg);
              } else {
                message.success('删除成功');
              }

              this.loadCollections();
            });
          },
        });
        break;
    }
  };

  onSelectTreeItem = (keys, ev) => {
    const { dispatch } = this.props;
    let [type, id] = keys[0].split('-');
    if (type === EventTargetTestCase) {
      dispatch({
        type: 'HttpDebug/loadTestCase',
        payload: {
          id,
        },
      }).then((res) => {
        if (res.code !== 0) {
          message.error('加载请求失败:' + res.msg);
        }
      });
    }
  };

  componentDidMount() {
    // this.loadCollections();
  }

  loadCollections = () => {
    const { dispatch, currentAppName } = this.props;
    dispatch({
      type: 'HttpDebug/fetchCollections',
      payload: {
        appName: currentAppName,
      },
    });
  };

  onTreeRightClick = (ev) => {
    let [type, id] = ev.node.props.eventKey.split('-');
    let collectionID = ev.node.collectionID;
    let menuState = {
      type,
      id,
      collectionID,
    };

    this.setState({
      rightMenuVisible: true,
      rightMenuItems: [
        {
          title: (
            <span>
              <DeleteOutlined style={{ marginRight: 10 }} />
              删除
            </span>
          ),
          key: EventTypeDelete,
        },
        {
          title: (
            <span>
              <FileAddOutlined style={{ marginRight: 10 }} />
              新建用例
            </span>
          ),
          key: EventTypeNewTestCase,
        },
        {
          title: (
            <span>
              <FolderAddOutlined style={{ marginRight: 10 }} />
              新建Collection
            </span>
          ),
          key: EventTypeNewCollection,
        },
      ],
      rightMenuState: menuState,
      rightMenuPosition: {
        x: ev.event.clientX,
        y: ev.event.clientY,
      },
    });
  };

  showModalCreateCollection = (visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'HttpDebug/showModalNewCollection',
      payload: visible,
    });
  };

  showModalCreateTestCase = (visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'HttpDebug/showModalNewTestCase',
      payload: {
        visible,
      },
    });
  };

  render() {
    const {
      modalNewRequestVisible,
      modalNewRequestFolderID,
      rightMenuVisible,
      rightMenuPosition,
      rightMenuItems,
      rightMenuState,
    } = this.state;
    const { collectionsLoading, collections } = this.props;
    const { folderTree } = this.props.model;
    return (
      <div className={styles.CollectionsTab}>
        <div className={styles.optionBar}>
          <Button
            onClick={() => {
              this.showModalCreateCollection(true);
            }}
            type={'link'}
            icon={<FolderAddOutlined />}
            size={'small'}
            title={'New Folder'}
          />
          <Button
            onClick={() => {
              this.showModalCreateTestCase(true);
            }}
            type={'link'}
            icon={<FileAddOutlined />}
            size={'small'}
            title={'New File'}
          />
        </div>

        <Spin spinning={collectionsLoading}>
          {collections && collections.length ? (
            <ReactScrollBar style={{ height: '710px' }}>
              <Tree.DirectoryTree
                onSelect={this.onSelectTreeItem}
                onRightClick={this.onTreeRightClick}
              >
                {(collections || []).map((item) => {
                  return (
                    <Tree.TreeNode
                      key={`collection-${item.id}`}
                      collectionID={item.id}
                      title={item.name}
                    >
                      {(item.test_cases || []).map((testCase) => {
                        return (
                          <Tree.TreeNode
                            key={`testcase-${testCase.id}`}
                            collectionID={item.id}
                            title={testCase.name}
                            isLeaf
                          />
                        );
                      })}
                    </Tree.TreeNode>
                  );
                })}
              </Tree.DirectoryTree>
            </ReactScrollBar>
          ) : (
            <Empty />
          )}
        </Spin>

        <NewCollectionModal />

        <NewTestCaseModal
          visible={modalNewRequestVisible}
          folderTree={folderTree}
          folderID={modalNewRequestFolderID}
          onCancel={() => {
            this.setState({
              modalNewRequestVisible: false,
            });
          }}
        />

        <RightMenu
          visible={rightMenuVisible}
          position={rightMenuPosition}
          menu={rightMenuItems}
          onClick={this.onMenuClick}
          state={rightMenuState}
          onCancel={() => {
            this.setState({
              rightMenuVisible: false,
            });
          }}
        />
      </div>
    );
  }
}
