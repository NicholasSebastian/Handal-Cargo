import { FC } from "react";
import styled from "styled-components";
import { Form, Input, InputNumber, Switch, Button } from "antd";
import { IInjectedProps } from "./withFormHandling";

const { Item } = Form;

// Creates a basic, minimally stylized form out of the given props.

function renderInput(type: InputType | undefined) {
  switch (type) {
    case 'number':
      return <InputNumber />
    case 'boolean':
      return <Switch />
    default:
      return <Input />
  }
}

const BasicForm: FC<IFormProps> = (props) => {
  const { formItems, initialValues, onSubmit } = props;
  return (
    <Container 
      initialValues={initialValues} 
      onFinish={onSubmit} 
      labelCol={{ span: 7 }}>
      {formItems.map(item => (
        <Item 
          key={item.key} 
          name={item.key} 
          label={item.label} 
          rules={[{ required: true, message: `${item.label} harus diisi.` }]}
          valuePropName={item.type === 'boolean' ? 'checked' : 'value'}>
          {renderInput(item.type)}
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
}

type InputType = 'string' | 'number' | 'boolean';
