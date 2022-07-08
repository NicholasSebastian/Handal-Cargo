import { FC } from "react";
import styled from "styled-components";
import { Form, Input, Button } from "antd";

const { Item } = Form;

const BasicForm: FC<IFormProps> = (props) => {
  const { formItems, initialValues, onSubmit } = props;
  return (
    <Container 
      initialValues={initialValues} 
      onFinish={onSubmit as never} 
      labelCol={{ span: 6 }}>
      {formItems.map(item => (
        <Item 
          key={item.key} 
          name={item.key} 
          label={item.label} 
          rules={[{ required: true, message: `${item.label} harus diisi.` }]}>
          <Input />
        </Item>
      ))}
      <Item><Button type="primary" htmlType="submit">Simpan</Button></Item>
    </Container>
  );
}

export type { IFormItem };
export default BasicForm;

const Container = styled(Form)`
  width: 460px;
  margin: 0 auto;
  
  > div:last-child {
    text-align: right;
    margin-bottom: 0;
  }
`;

interface IFormProps {
  formItems: Array<IFormItem>
  initialValues?: { [key: string]: any }
  onSubmit: (values: any) => void
}

interface IFormItem {
  key: string
  label: string
}
