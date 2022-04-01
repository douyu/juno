import React from 'react';

const styles = require('./index.less');

export interface HeaderActionItem {
  render: () => JSX.Element;
  onClick: (item: HeaderActionItem) => void;
}

export interface PanelProps {
  title: string;
  headerActions?: HeaderActionItem[];
  style?: React.CSSProperties;
}

export default class Panel extends React.Component<PanelProps> {
  render() {
    const { title = '标题', headerActions = [], children, style = {} } = this.props;

    return (
      <div className={styles.panel} style={{ ...style }}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.actions}>
            {headerActions.map((item, index) => {
              return (
                <span key={index} onClick={() => item.onClick(item)}>
                  {item.render()}
                </span>
              );
            })}
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}
