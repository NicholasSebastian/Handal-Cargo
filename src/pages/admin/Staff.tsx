import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Form, Input, Select, Switch, Button, Spin, message } from 'antd';
import useDatabase from "../../data/useDatabase";
import TableTemplate from "../../components/TableTemplate";

const { Item } = Form;
const { Password } = Input;
const { Option } = Select;

// TODO: Maybe upgrade the table and list templates to accept an array of formitems instead.

const Staff: FC = () => {
  return (
    <TableTemplate 
      collectionName="Staff"
      columns={[
        { dataIndex: 'username', title: 'Nama Pengguna' }
        // TODO
      ]}
      viewItems={[
        { key: 'username', label: 'Nama Pengguna' }
        // TODO
      ]}
      form={props => {
        const { initialValues, onSubmit } = props;
        const database = useDatabase()!;

        // Load the references needed for the form.
        const [accessLevels, setAccessLevels] = useState<Array<any>>();
        const [staffGroups, setStaffGroups] = useState<Array<any>>();
        useEffect(() => {
          Promise.all([
            database.collection("AccessLevels").find({}, { projection: { name: 1 } }),
            database.collection("StaffGroups").find({}, { projection: { name: 1 } })
          ])
          .then(([results1, results2]) => {
            setAccessLevels(results1);
            setStaffGroups(results2);
          })
          .catch(() => message.error('Error loading form data.'));
        }, []);

        if (!accessLevels || !staffGroups) return <Spin />
        return (
          <Container 
            initialValues={initialValues} 
            onFinish={onSubmit} 
            labelCol={{ span: 7 }}>
            <Item name='username' label="Nama Pengguna" 
              rules={[{ required: true, message: "Nama Pengguna harus diisi." }]}>
              <Input />
            </Item>
            <Item name='password' label="Kata Sandi" 
              rules={[{ required: true, message: "Kata Sandi harus diisi." }]}>
              <Password />
            </Item>
            <Item name='name' label="Nama" 
              rules={[{ required: true, message: "Nama harus diisi." }]}>
              <Input />
            </Item>
            <Item name='access_level' label="Level Akses" 
              rules={[{ required: true, message: "Tingkat Akses harus diisi." }]}>
              <Select>
                {accessLevels.map(val => {
                  const id = val._id.toString();
                  return (
                    <Option key={id} value={id}>{val.name}</Option>
                  );
                })}
              </Select>
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
