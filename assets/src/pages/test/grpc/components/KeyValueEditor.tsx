import React from 'react';
import styles from './KeyValueEditor.less';
import {DeleteOutlined} from "@ant-design/icons";

interface DataItem {
  key: string,
  value: string,
  description?: string,
}

export interface KeyValueEditorProps {
  data: DataItem[],
  onChange: (data: DataItem[]) => void,
}

interface CustomInputProps {
  onChange: (val: string) => void
  value: string
  placeholder?: string
}

function CustomInput(props: CustomInputProps) {
  return <input
    placeholder={props.placeholder}
    onChange={(e) => props.onChange(e.target.value)}
    className={styles.input}
    value={props.value}
  />
}

export default class KeyValueEditor extends React.Component<KeyValueEditorProps> {

  render() {
    let {data} = this.props;
    let rows = data.concat({
      key: '',
      value: '',
      description: '',
    });

    return <div className={styles.table}>
      <div className={styles.header}>
        <div className={styles.column}>Key</div>
        <div className={styles.column}>Value</div>
        <div className={styles.column}>Description</div>
        <div className={styles.column}></div>
      </div>
      {rows.map((item, index) => {
        return <div className={styles.row}>
          {Object.keys(item).map(key => (
            <div className={styles.column} key={key}>
              <CustomInput placeholder={key} value={item[key]} onChange={(val) => {
                rows[index][key] = val;
                let dataChanged = data;
                if (index >= data.length) {
                  dataChanged = dataChanged.concat(rows[index]);
                } else {
                  dataChanged[index] = rows[index];
                }
                this.props.onChange(dataChanged);
              }}/>
            </div>
          ))}
          <div className={styles.column}>
            {(index !== rows.length - 1) ? (
              <DeleteOutlined
                type="delete"
                className={styles.btnDelete}
                onClick={() => {
                  let dataChanged = data.filter((item, idx) => idx !== index);
                  this.props.onChange(dataChanged);
                }}
              />
            ) : null}
          </div>
        </div>;
      })}
    </div>
  }
}
