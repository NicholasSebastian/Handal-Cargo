import { FC, ComponentType, useId } from "react";
import styled from "styled-components";
import { List, Button, Modal, Input, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useRoute from "../data/useRoute";
import BasicForm, { IFormItem } from "./BasicForm";
import withDataHandlers, { IHandledProps } from "./withDataHandlers";
import withFormHandling, { IInjectedProps } from "./withFormHandling";

const { Item } = List;
const { Search } = Input;

const ListTemplate: FC<ITemplateProps> = props => {
  const { collectionName, itemSubtext, form, nameLabel } = props;
  const { title } = useRoute()!;

  // From the 'withDataHandlers' higher-order function.
  const { data, modal, handleAdd, handleEdit, handleDelete, setSearch, setModal } = props;

  // The form will be rendered depending on the given 'form' prop.
  const renderForm = () => {
    const isBlank = form === undefined;
    const isArray = Array.isArray(form);
    const formProps = { 
      key: modal?.id?.toString() ?? useId(), // Will only reuse forms for the same items. 
      collectionName, 
      id: modal?.id, 
      handleAdd, 
      handleEdit 
    };

    if (isBlank || isArray) {
      const FormComponent = withFormHandling(BasicForm);
      const item1 = { key: 'name', label: nameLabel };
      return isArray ? (
        <FormComponent {...formProps} formItems={[item1, ...form]} />
      ) : (
        <FormComponent {...formProps} formItems={[item1]} />
      );
    }
    else {
      const FormComponent = withFormHandling(form);
      return (
        <FormComponent {...formProps} />
      );
    }
  };

  return (
    <Container>
      <div>
        <Search allowClear 
          placeholder="Cari" 
          style={{ width: 250 }} 
          onSearch={val => setSearch(val)} />
        <Button block 
          type='dashed' 
          icon={<PlusOutlined />} 
          onClick={() => setModal({})}>
          New
        </Button>
      </div>
      <List 
        size='small' 
        dataSource={data} 
        loading={data === undefined}
        renderItem={entry => (
          <Item actions={[
            <Button onClick={() => setModal({ id: entry._id })}>Edit</Button>,
            <Popconfirm 
              title="Yakin di hapus?" 
              placement="left"
              onCancel={e => e?.stopPropagation()}
              onConfirm={e => {
                e?.stopPropagation();
                handleDelete(entry._id);
              }}>
              <Button onClick={e => e.stopPropagation()}>Delete</Button>
            </Popconfirm>
          ]}>
            <ItemContainer>
              <div>{entry.name}</div>
              {itemSubtext && itemSubtext(entry)}
            </ItemContainer>
          </Item>
        )} />
      <Modal centered maskClosable 
        title={(modal?.id ? 'Edit ' : 'New ') + title}
        visible={modal !== null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={600} 
        bodyStyle={{ padding: '30px 0', display: 'flex', justifyContent: 'center' }}>
        {renderForm()}
      </Modal>
    </Container>
  );
}

export default withDataHandlers(ListTemplate);

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;

  > div:first-of-type {
    display: flex;
    flex-direction: column;
    align-items: end;

    > span:first-child {
      margin-bottom: 10px;
    }
  }
`;

const ItemContainer = styled.div`
  display: flex;

  > div:first-of-type {
    width: 20vw;
  }
`;

interface ITemplateProps extends IHandledProps {
  itemSubtext?: (entry: any) => React.ReactNode
  form?: ComponentType<IInjectedProps> | Array<IFormItem>
  nameLabel: string
}
