import { FC, Fragment } from "react";
import styled from "styled-components";
import { Form, Input, Checkbox, Button, Divider } from "antd";
import ListTemplate from "../../components/compounds/ListTemplate";
import pages from '../../navigation';
import { toSlug } from "../../utils";

// TODO: Create a role for every single collection in the MongoDB App Services UI.
//       Each collection should only grant read and write permissions to users with the corresponding access level.

// NOTE: The staff collection is an exception. 
//       It should also have document-level permissions; To give read permissions to users of with a matching name.

const { Item } = Form;
const { Group } = Checkbox;

const AccessLevels: FC = () => {
  return (
    <ListTemplate
      collectionName="AccessLevels"
      searchBy="name"
      secondaryColumn={entry => '★'.repeat(entry.access_level.length)}
      form={props => {
        const { initialValues, onSubmit } = props;
        return (
          <Container
            initialValues={initialValues} 
            onFinish={onSubmit} 
            labelCol={{ span: 7 }}>
            <Item name='name' label="Nama Level"
              rules={[{ required: true, message: "Nama harus diisi." }]}>
              <Input />  
            </Item>
            <Item name='access_level'>
              <Group style={{ width: '100%', textAlign: 'center' }}>
                {Object.values(pages).map((category, i) => {
                  const pages = Object.keys(category);
                  const middle = Math.floor(pages.length / 2);
                  return (
                    <Fragment>
                      {i > 0 && <Divider />}
                      {pages.map((page_name, j) => {
                        const page_slug = toSlug(page_name);
                        return (
                          <Fragment>
                            {j === middle && <br />}
                            <Checkbox value={page_slug}>{page_name}</Checkbox>
                          </Fragment>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </Group>
            </Item>
            <Item>
              <Button type="primary" htmlType="submit">Simpan</Button>
            </Item>
          </Container>
        );
      }} />
  );
}

export default AccessLevels;

const Container = styled(Form)`
  width: 500px;

  div.ant-checkbox-group > label {
    line-height: 30px;
  }
  
  > div:last-child {
    text-align: right;
    margin-bottom: 0;
  }
`;
