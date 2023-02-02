import { FC, Fragment, isValidElement } from "react";
import styled from "styled-components";
import { Form, Input, Checkbox, Button, Divider } from "antd";
import ListTemplate from "../../components/compounds/ListTemplate";
import pages from '../../navigation';
import { toSlug } from "../../utils";

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
                {Object.entries(pages).map(([name, component], i) => {
                  const pages = Object.keys(component);
                  const middle = Math.floor(pages.length / 2);
                  return (
                    <Fragment>
                      {i > 0 && <Divider style={{ margin: '20px 0' }} />}
                      {isValidElement(component) ? (
                        <Checkbox value={toSlug(name)}>{name}</Checkbox>
                      ) : (
                        pages.map((page_name, j) => (
                          <Fragment>
                            {(pages.length > 1) && (j === middle) && <br />}
                            <Checkbox value={toSlug(page_name)}>{page_name}</Checkbox>
                          </Fragment>
                        ))
                      )}
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
