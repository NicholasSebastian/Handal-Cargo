import { FC } from "react";
import styled from "styled-components";
import { Form, Input, Switch, Button } from 'antd';
import TableTemplate from "../../components/TableTemplate";

const { Item } = Form;
const { Password } = Input;

const Staff: FC = () => {
  return (
    <TableTemplate 
      collectionName="Staff"
      columns={[
        { dataIndex: 'username', title: 'Username' }
        // TODO
      ]}
      viewItems={[
        { key: 'username', label: 'Username' }
        // TODO
      ]}
      form={props => {
        const { initialValues, onSubmit } = props;
        return (
          <Container 
            initialValues={initialValues} 
            onFinish={onSubmit} 
            labelCol={{ span: 7 }}>
            <Item name='username' label="Username" 
              rules={[{ required: true, message: "Username harus diisi." }]}>
              <Input />
            </Item>
            <Item name='password' label="Password" 
              rules={[{ required: true, message: "Password harus diisi." }]}>
              <Password />
            </Item>
            {/* TODO */}
            <Item><Button type="primary" htmlType="submit">Simpan</Button></Item>
          </Container>
        );
      }} />
  );
}

export default Staff;

const Container = styled(Form)`
  width: 500px;

  > div:last-child {
    text-align: right;
    margin-bottom: 0;
  }
`;
