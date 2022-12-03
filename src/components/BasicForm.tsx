import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Form, Input, InputNumber, Switch, Select, Button, DatePicker } from "antd";
import useDatabase from "../data/useDatabase";
import { IInjectedProps } from "./withFormHandling";
import { datesToMoments } from "../utils";

const { Item } = Form;
const { Option } = Select;
const { Password } = Input;

// Creates a basic, minimally stylized form out of the given props.

// TODO: Add support for Steps.

function renderInput(type: InputType | undefined, items?: Array<string>) {
  switch (type) {
    case 'number':
      return <InputNumber />
    case 'boolean':
      return <Switch />
    case 'select':
      return <Select>{items?.map((item, i) => <Option key={i} value={item}>{item}</Option>)}</Select>
    case 'date': 
      return <DatePicker />
    case 'password':
      return <Password />
    default:
      return <Input />
  }
}

const BasicForm: FC<IFormProps> = (props) => {
  const { formItems, initialValues, onSubmit } = props;
  const database = useDatabase()!;
  
  const [referenceValues, setReferenceValues] = useState<Record<string, Array<string>>>();
  useEffect(() => {
    const referenceItems = formItems.filter(item => item.type === 'select' && typeof item.items === 'string');
    Promise.all(
      referenceItems.map(item => {
        const collectionName = item.items as string;
        return database
          .collection(collectionName)
          .find({}, { projection: { name: 1 } });
      }))
    .then(references => {
      const values = Object.fromEntries(references.map((values, i) => {
        const collectionName = referenceItems[i].items;
        return [collectionName, values.map(v => v.name)];
      }));
      setReferenceValues(values);
    });
  }, []);

  return (
    <Container 
      initialValues={datesToMoments(initialValues)} 
      onFinish={onSubmit} 
      labelCol={{ span: 7 }}>
      {formItems.map(item => (
        <Item 
          key={item.key} 
          name={item.key} 
          label={item.label} 
          rules={item.required === false ? undefined : 
            [{ required: true, message: `${item.label} harus diisi.` }]}
          valuePropName={item.type === 'boolean' ? 'checked' : 'value'}>
          {renderInput(
            item.type, 
            (item.type === 'select') &&   // If 'select' type
            (item.items !== undefined) && // and items exist
            (Array.isArray(item.items)
              ? item.items                // Use the items as they are if already an array
              : referenceValues && referenceValues[item.items] // else its loaded in the state.
            ) 
            || undefined // Default to undefined if falsy.
          )}
        </Item>
      ))}
      <Item><Button type="primary" htmlType="submit">Simpan</Button></Item>
    </Container>
  );
}

export type { IFormItem };
export default BasicForm;

const Container = styled(Form)`
  width: 500px;
  
  > div:last-child {
    text-align: right;
    margin-bottom: 0;
  }
`;

interface IFormProps extends IInjectedProps {
  formItems: Array<IFormItem>
}

interface IFormItem {
  key: string
  label: string
  type?: InputType
  items?: string | Array<string> // For only 'select' types.
  required?: boolean
}

type InputType = 'string' | 'password' | 'number' | 'boolean' | 'select' | 'date';
