import { FC, CSSProperties } from "react";
import styled from "styled-components";
import { List, Button, Modal, Input, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useTemplateHandlers from "../abstracts/useTemplateHandlers";
import FallbackForm, { FormPropType } from "./FallbackForm";

const { Item } = List;
const { Search } = Input;

const ListTemplate: FC<ITemplateProps> = props => {
  const { collectionName, searchBy, itemSubtext, form } = props;
  const { data, modal, setSearch, setModal, getFormTitle, handlers } = useTemplateHandlers(collectionName, searchBy);
  const { handleAdd, handleEdit, handleDelete } = handlers;
  const modalHasId = (modal !== null && 'id' in modal);

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
            <Button 
              onClick={() => setModal({ mode: 'edit', id: entry._id })}>
              Edit
            </Button>,
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
        title={getFormTitle()}
        visible={modal !== null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={600} 
        bodyStyle={ModalStyles}>
        <FallbackForm 
          collectionName={collectionName}
          form={form}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          id={modalHasId ? modal.id : undefined} />
      </Modal>
    </Container>
  );
}

export default ListTemplate;

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
  justifyContent: 'center',
  maxHeight: '80vh',
  overflowY: 'scroll'
};

interface ITemplateProps {
  collectionName: string
  searchBy: string
  itemSubtext?: (entry: any) => React.ReactNode
  form: FormPropType
}
