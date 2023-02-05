import { FC, CSSProperties } from "react";
import styled from "styled-components";
import { List, Button, Modal, Popconfirm, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useTemplateHandlers from "../abstractions/useTemplateHandling";
import { ModalStyles } from "./TableTemplate";
import FallbackForm, { FormPropType } from "./FallbackForm";
import Search from '../basics/Search';

const { Item } = List;

const ListTemplate: FC<ITemplateProps> = props => {
  const { collectionName, searchBy, secondaryColumn, form } = props;
  const { data, loading, modal, setSearch, setModal, getFormTitle, handlers } = useTemplateHandlers(collectionName, searchBy);
  const { handleAdd, handleEdit, handleDelete } = handlers;
  const modalHasId = (modal !== null && 'id' in modal);

  return (
    <Container>
      <div>
        <Search onSearch={setSearch} />
        <Button block 
          type='dashed' 
          icon={<PlusOutlined />} 
          onClick={() => setModal({ mode: 'add' })}>
          Baru
        </Button>
      </div>
      <Spin spinning={loading}>
        <List 
          size='small' 
          dataSource={data} 
          loading={data === undefined}
          renderItem={(entry, i) => (
            <Item key={i} actions={[
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
                <Button onClick={e => e.stopPropagation()}>Hapus</Button>
              </Popconfirm>
            ]}>
              <ItemContainer>
                <div>{entry.name}</div>
                {secondaryColumn && secondaryColumn(entry)}
              </ItemContainer>
            </Item>
          )} />
      </Spin>
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

    > div:first-child {
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

interface ITemplateProps {
  collectionName: string
  searchBy: string
  secondaryColumn?: (entry: any) => React.ReactNode
  form: FormPropType
}
