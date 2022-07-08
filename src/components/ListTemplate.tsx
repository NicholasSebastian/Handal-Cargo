import { FC, useState, useEffect } from "react";
import { BSON } from 'realm-web';
import styled from "styled-components";
import { List, Button, Modal, Input, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as generateKey } from 'uuid';
import useDatabase from "../data/useDatabase";
import useRoute from "../data/useRoute";
import { IFormItem } from "./BasicForm";
import DynamicForm from "./DynamicForm";

const { Item } = List;
const { Search } = Input;

const ListTemplate: FC<ITemplateProps> = ({ collectionName, nameLabel, extra }) => {
  const database = useDatabase();
  const { title } = useRoute()!;
  const [data, setData] = useState<Array<IData>>();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalState>(null);

  const refreshData = () => {
    const query = (search.length > 0) 
      ? { name: { $regex: search, $options: 'i' } } 
      : {};

    database?.collection(collectionName)
      .find(query)
      .then(results => {
        if (results) setData(results);
      });
  };
  
  const handleAdd = (values: any) => {
    database?.collection(collectionName)
      .insertOne(values)
      .then(() => {
        message.success(`${values.name} telah disimpan.`);
        setModal(null);
        refreshData();
      });
  };

  const handleEdit = (entryId: BSON.ObjectId, values: any) => {
    database?.collection(collectionName)
      .updateOne({ _id: entryId }, { $set: values })
      .then(() => {
        message.success(`${values.name} telah diubah.`);
        setModal(null);
        refreshData();
      });
  };

  const handleDelete = (entryId: BSON.ObjectId) => {
    database?.collection(collectionName)
      .deleteOne({ _id: entryId })
      .then(() => {
        message.success("Item telah dihapus.");
        refreshData();
      });
  };

  useEffect(refreshData, [search]);
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
      <List size='small' dataSource={data} loading={data === undefined}
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
              {Object.entries(entry).map(([key, value]) => {
                if (key === '_id') return;
                return (
                  <div key={key}>{value}</div>
                );
              })}
            </ItemContainer>
          </Item>
        )} />
      <Modal centered maskClosable 
        title={(modal?.id ? 'Edit ' : 'New ') + title}
        visible={modal !== null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={600} 
        bodyStyle={{ padding: '30px 0' }}>
        <DynamicForm 
          collectionName={collectionName}
          formItems={(() => {
            // Either it has only one field being of key 'name', or it has another extra field too.
            const nameField = { key: 'name', label: nameLabel };
            return extra ? [nameField, extra] : [nameField];
          })()}
          key={modal?.id?.toString() ?? generateKey()} // Will only reuse forms for the same items.
          id={modal?.id} 
          handleAdd={handleAdd} 
          handleEdit={handleEdit} />
      </Modal>
    </Container>
  );
}

export type { IData };
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

interface IData {
  _id: BSON.ObjectId
  name: string
}

type ModalState = null | { id?: BSON.ObjectId }

interface ITemplateProps {
  collectionName: string
  nameLabel: string
  extra?: IFormItem
}
