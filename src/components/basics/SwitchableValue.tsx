import { FC, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Form, Input as AntInput, Button } from "antd";
import useDatabase from "../../data/useDatabase";
import { ICustomComponentProps } from "./BasicForm";

const { useFormInstance, Item } = Form;

function createSwitchableValue(config: ISwitchableValueConfig): FC<ICustomComponentProps> {
  const { label, labelSpan, altSource, ...args } = config;
  return props => {
    const { itemKey, value } = props;
    const database = useDatabase();
    const form = useFormInstance();

    const [isAlt, setAlt] = useState(false);
    const oriValue = useRef<string>();
    const altValue = useRef<string>();

    // A very retarded way to wait for the initial value to load before caching it.
    useEffect(() => {
      if (oriValue.current == undefined) {
        oriValue.current = value;
      }
    }, [value]);

    // Fetch and cache the alternate value.
    useEffect(() => {
      const localValue = form.getFieldValue(altSource.localField);
      altSource.getter(database, localValue).then(result => {
        altValue.current = result;
      });
    }, []);

    const handleChange = (value: string) => {
      form.setFieldsValue({ ...form.getFieldsValue(true), [itemKey!]: value });
    }

    return (
      <Item
        label={label}
        labelCol={(labelSpan != null) ? { span: labelSpan } : undefined}
        style={{ marginBottom: 0 }}>
        <Input 
          value={value}
          onChange={e => handleChange(e.target.value)}
          style={{ width: '100%' }}
          addonAfter={
            <Button 
              type='text' 
              icon={1 + (isAlt as never)}
              onClick={() => {
                if (isAlt) {
                  handleChange(oriValue.current ?? '');
                  setAlt(false);
                }
                else {
                  handleChange(altValue.current ?? '');
                  setAlt(true);
                }
              }} />
          }
          {...args} />
      </Item>
    );
  }
}

export default createSwitchableValue;

const Input = styled(AntInput)`
  .ant-input-group-addon {
    padding: 0;

    > button {
      border: 0;
      margin-bottom: -1px;
      margin-top: -1px;
      padding: 0;
    }
  }
`;

interface ISwitchableValueConfig {
  label: string
  labelSpan?: number
  altSource: {
    localField: string
    getter: (database: Realm.Services.MongoDBDatabase | undefined, localValue: any) => Promise<any>
  }
  [key: string]: any
}
