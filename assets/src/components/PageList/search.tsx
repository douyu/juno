import React, { Component } from 'react';
import { Button, Input, Select, DatePicker, Form, TreeSelect } from 'antd';
import { initialValue } from '@/utils/form';
import moment from 'moment/moment';
import { FormInstance } from 'antd/lib/form';
import styles from './search.less';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const count = (params) => {
  let count = 0;
  for (var property in params) {
    if (Object.prototype.hasOwnProperty.call(params, property)) {
      count++;
    }
  }
  return count;
};
class Search extends React.Component {
  formRef = React.createRef<FormInstance>();

  static defaultProp = {
    loading: false,
    items: [],
    onSubmit: () => {},
    onReset: () => {},
    defaultValue: {},
    getInstance: () => {},
  };
  constructor(props) {
    super(props);

    if (typeof props['getInstance'] !== 'undefined') {
      props.getInstance(this);
    }
  }
  render() {
    const { items, onSubmit, onReset, style } = this.props;
    let _items = [...items];
    if (typeof onSubmit === 'function') {
      _items.push({
        submit: {},
      });
    }
    if (typeof onReset === 'function') {
      _items.push({
        reset: {
          onClick: onReset,
        },
      });
    }

    return (
      <Form
        layout="inline"
        className={styles.customAdvancedSearch}
        style={style ? style : {}}
        ref={this.formRef}
        onFinish={(values) => {
          // 过滤时间统一为时间戳
          items.map((item) => {
            if (typeof item['timeRange'] !== 'undefined') {
              values[item.timeRange.field] = this.timeRangeToStamp(values[item.timeRange.field]);
            }
          });
          onSubmit(values);
        }}
      >
        {_items.map((item, index) => {
          if (typeof item['input'] !== 'undefined') {
            return this.renders['input'](this.formatItem(item), index);
          }
          if (typeof item['select'] !== 'undefined') {
            return this.renders['select'](this.formatItem(item), index);
          }
          if (typeof item['selectInput'] !== 'undefined') {
            return this.renders['selectInput'](this.formatItem(item), index);
          }
          if (typeof item['timeRange'] !== 'undefined') {
            return this.renders['timeRange'](this.formatItem(item), index);
          }
          if (typeof item['treeSelect'] !== 'undefined') {
            return this.renders['treeSelect'](this.formatItem(item), index);
          }
          if (typeof item['submit'] !== 'undefined') {
            return this.renders['submit'](this.formatItem(item), index);
          }
          if (typeof item['reset'] !== 'undefined') {
            return this.renders['reset'](this.formatItem(item), index);
          } else {
            return null;
          }
        })}
      </Form>
    );
  }
  componentDidMount() {
    let _values = {};

    Object.keys(this.values).forEach((key) => {
      if (typeof this.values[key] !== 'undefined' && this.values[key] !== null) {
        _values[key] = this.values[key];
      }
    });
    if (count(_values) > 0) {
      this.formRef.current.setFieldsValue(_values);
    }
  }
  formatItem = (item) => {
    return item;
  };

  timeRangeToStamp(times) {
    if (times && Array.isArray(times) && times.length === 2) {
      times = [moment(times[0]).unix(), moment(times[1]).unix()];
    } else {
      times = [];
    }
    return times;
  }
  values = {};
  renders = {
    input: (item, index) => {
      const { defaultValue } = this.props;
      let { input, label } = item;
      input = Object.assign(
        {
          field: null,
          placeholder: null,
          onChange: (value) => {},
          initialValue: null,
        },
        input,
      );
      this.values[input.field] = input.initialValue;

      return (
        <Form.Item
          label={label}
          key={index}
          name={input.field}
          initialValue={defaultValue[input.field]}
        >
          <Input
            placeholder={input.placeholder}
            onChange={(e) => {
              input.onChange(e);
            }}
          />
        </Form.Item>
      );
    },
    select: (item, index) => {
      const { defaultValue } = this.props;
      let { select, label } = item;

      select = Object.assign(
        {
          field: null,
          style: null,
          placeholder: null,
          onChange: (value) => {},
          allowClear: true,
          initialValue: null,
        },
        select,
      );
      this.values[select.field] = select.initialValue;

      return (
        <Form.Item
          label={label}
          key={index}
          name={select.field}
          initialValue={defaultValue[select.field]}
        >
          <Select
            showSearch
            placeholder={select.placeholder}
            allowClear={select.allowClear}
            style={select.style}
            onChange={(e) => {
              select.onChange(e);
            }}
          >
            {(select.data || []).map((op, opIndex) => {
              return (
                <Option value={op.value} key={opIndex}>
                  {op.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      );
    },
    selectInput: (item, index) => {
      const { defaultValue } = this.props;
      let { selectInput, label } = item;

      const select = Object.assign(
        {
          field: null,
          style: { minWidth: 115 },
          placeholder: null,
          onChange: (value) => {},
          initialValue: null,
          data: [
            { name: '标题1', value: 'value1' },
            { name: '标题2', value: 'value2' },
          ],
        },
        selectInput[0],
      );

      const input = Object.assign(
        {
          field: null,
          placeholder: null,
          onChange: (value) => {},
          initialValue: null,
        },
        selectInput[1],
      );
      this.values[select.field] = select.initialValue;
      this.values[input.field] = input.initialValue;

      return (
        <>
          <Form.Item
            label={label}
            key={index}
            layout="inline"
            name={select.field}
            initialValue={defaultValue[select.field]}
          >
            <Select
              style={select.style}
              placeholder={select.placeholder}
              onChange={(e) => {
                input.onChange(e);
              }}
            >
              {select.data.map((op, opIndex) => {
                return (
                  <Option value={op.value} key={opIndex}>
                    {op.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <FormItem
            layout="inline"
            label={label}
            key={index}
            name={input.field}
            initialValue={defaultValue[input.field]}
          >
            <Input
              // addonBefore={prefixSelector}
              placeholder={input.placeholder}
              onChange={(e) => {
                input.onChange(e);
              }}
            />
          </FormItem>
        </>
      );
    },
    timeRange: (item, index) => {
      const { defaultValue } = this.props;
      let { timeRange, label } = item;

      timeRange = Object.assign(
        {
          field: null,
          style: null,
          placeholder: null,
          onChange: (value) => {},
          allowClear: true,
          initialValue: null,
        },
        timeRange,
      );

      if (Array.isArray(timeRange.initialValue) && timeRange.initialValue.length === 2) {
        timeRange.initialValue = [
          moment(parseInt(timeRange.initialValue[0] + '000')),
          moment(parseInt(timeRange.initialValue[1] + '000')),
        ];
      }
      this.values[timeRange.field] = timeRange.initialValue;

      return (
        <Form.Item
          label={label}
          key={index}
          name={timeRange.field}
          initialValue={defaultValue[timeRange.field]}
        >
          <RangePicker
            allowClear={true}
            onChange={(dates, create_time) => {
              timeRange.onChange(dates, create_time);
            }}
          />
        </Form.Item>
      );
    },
    treeSelect: (item, index) => {
      const { defaultValue } = this.props;
      let { treeSelect, label } = item;

      treeSelect = Object.assign(
        {
          field: null,
          style: null,
          dropdownStyle: null,
          placeholder: '请选择',
          multiple: false,
          treeDefaultExpandAll: false,
          treeData: [],
          onChange: (value) => {},
          allowClear: true,
          initialValue: null,
        },
        treeSelect,
      );
      this.values[treeSelect.field] = treeSelect.initialValue;

      return (
        <Form.Item
          label={label}
          key={index}
          name={treeSelect.field}
          initialValue={defaultValue[treeSelect.field]}
        >
          <TreeSelect
            style={treeSelect.style}
            dropdownStyle={treeSelect.dropdownStyle}
            treeData={treeSelect.treeData}
            placeholder={treeSelect.placeholder}
            treeDefaultExpandAll={treeSelect.treeDefaultExpandAll}
            allowClear={treeSelect.allowClear}
            multiple={treeSelect.multiple}
          />
        </Form.Item>
      );
    },
    submit: (item, index) => {
      const { loading } = this.props;
      return (
        <Form.Item key={index}>
          <Button type="primary" htmlType="submit" loading={loading}>
            查询
          </Button>
        </Form.Item>
      );
    },
    reset: (item, index) => {
      const { defaultValue } = this.props;
      let { reset } = item;

      reset = Object.assign(
        {
          onClick: () => {},
        },
        reset,
      );
      return (
        <Form.Item key={index}>
          <Button
            htmlType="reset"
            onClick={() => {
              // this.form.current.resetFields(Object.keys(defaultValue));
              reset.onClick(defaultValue);
              this.formRef.current.resetFields();
            }}
          >
            清空条件
          </Button>
        </Form.Item>
      );
    },
  };
  resetValues() {
    const { defaultValue } = this.props;
    form.resetFields(Object.keys(defaultValue));
  }
}

export default Search;
