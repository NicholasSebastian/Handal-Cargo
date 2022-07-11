import { FC, ComponentType, CSSProperties, useId } from "react";
import styled from "styled-components";
import { List, Button, Modal, Input, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useRoute from "../data/useRoute";
import withDataHandlers, { IHandledProps } from "./withDataHandlers";
import withFormHandling, { IInjectedProps } from "./withFormHandling";
import BasicForm, { IFormItem } from "./BasicForm";

const { Item } = List;
const { Search } = Input;

const ListTemplate: FC<ITemplateProps> = props => {
  const { collectionName, itemSubtext, form, nameLabel } = props;
  const { title } = useRoute()!;

  // From the 'withDataHandlers' higher-order function.
  const { data, modal, handleAdd, handleEdit, handleDelete, setSearch, setModal } = props;
  const modalHasId = (modal !== null && modal.mode !== 'add');

  // The form will be rendered depending on the given 'form' prop.
  const renderForm = () => {
    const isBlank = form === undefined;
    const isArray = Array.isArray(form);
    const formProps = { 
      key: modalHasId ? modal.id.toString() : useId(), // Will only reuse forms for the same items. 
      collectionName, 
      handleAdd, 
      handleEdit, 
      id: modalHasId ? modal.id : undefined
    };

    // Render a BasicForm component if the given form prop is undefined or an array of items.
    if (isBlank || isArray) {
      const FormComponent = withFormHandling(BasicForm);
      const item1 = { key: 'name', label: nameLabel };
      return isArray ? (
        <FormComponent {...formProps} formItems={[item1, ...form]} />
      ) : (
        <FormComponent {...formProps} formItems={[item1]} />
      );
    }
    // Render the given form component instead if specified.
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
          onClick={() => setModal({ mode: 'add' })}>
          New
        </Button>
      </div>
      <List 
        size='small' 
        dataSource={data} 
        loading={data === undefined}
        renderItem={entry => (
          <Item actions={[
            <Button onClick={() => setModal({ mode: 'edit', id: entry._id })}>Edit</Button>,
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
        title={(modalHasId ? 'Edit ' : 'New ') + title}
        visible={modal !== null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={600} 
        bodyStyle={ModalStyles}>
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

const ModalStyles: CSSProperties = { 
  padding: '30px 0', 
  display: 'flex', 
  justifyContent: 'center' 
};

interface ITemplateProps extends IHandledProps {
  itemSubtext?: (entry: any) => React.ReactNode
  form?: ComponentType<IInjectedProps> | Array<IFormItem>
  nameLabel: string
}
