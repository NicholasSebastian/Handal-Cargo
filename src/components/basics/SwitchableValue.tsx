import { FC, Fragment, ComponentProps, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Form, Input as AntInput, Button } from "antd";
import useDatabase from "../../data/useDatabase";
import { ICustomComponentProps } from "./BasicForm";

const { useFormInstance, Item } = Form;
const { TextArea } = AntInput;

function createSwitchableValue(config: ISwitchableValueConfig): FC<ICustomComponentProps> {
  const { label, labelSpan, textarea, disabled, altSource, ...args } = config;
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

    const itemProps: ItemProps = {
      label,
      labelCol: (labelSpan != null) ? { span: labelSpan } : undefined,
      style: { marginBottom: 0 }
    };

    const buttonProps: ButtonProps = {
      icon: 1 + (isAlt as never),
      onClick: () => {
        if (isAlt) {
          handleChange(oriValue.current ?? '');
          setAlt(false);
        }
        else {
          handleChange(altValue.current ?? '');
          setAlt(true);
        }
      }
    };

    if (textarea) return (
      <Fragment>
        <Item {...itemProps}>
          <TextArea
            {...args}
            rows={5}
            value={value}
            disabled={disabled}
            onChange={e => handleChange(e.target.value)} />
        </Item>
        <Button style={{ float: 'right', marginTop: '-32px' }} {...buttonProps} />
      </Fragment>
    );
    return (
      <Item {...itemProps}>
        <Input 
          {...args}
          value={value}
          onChange={e => handleChange(e.target.value)}
          style={{ width: '100%' }}
          disabled={disabled}
          addonAfter={
            <Button type='text' {...buttonProps} />
          } />
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
  textarea?: boolean
  disabled?: boolean
  altSource: {
    localField: string
    getter: (database: Realm.Services.MongoDBDatabase | undefined, localValue: any) => Promise<any>
  }
  [key: string]: any
}

type ItemProps = ComponentProps<typeof Item>;
type ButtonProps = ComponentProps<typeof Button>;
