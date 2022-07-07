import { FC, useState, useEffect } from "react";
import { BSON } from 'realm-web';
import styled from "styled-components";
import { List, Button, Modal, Input, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useDatabase from "../data/useDatabase";

const { Item } = List;
const { Search } = Input;

const ListTemplate: FC<ITemplateProps> = ({ collectionName }) => {
  const [data, setData] = useState<Array<IData>>([]);
  const [search, setSearch] = useState('');
  const database = useDatabase();

  const refreshData = () => {
    const query = (search.length > 0) 
      ? { name: { '$regex': search, '$options': 'i' } } 
      : {};

    database?.collection(collectionName)
      .find(query)
      .then(results => {
        if (results) setData(results);
      });
  };
  
  const handleAdd = () => {
    database?.collection(collectionName)
      .insertOne({ name: "Test" })
      .then(() => {
        message.success(`{name} telah disimpan.`);
        refreshData();
      });
  };

  const handleEdit = (entryId: BSON.ObjectId) => null;

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
        <Search placeholder="Cari" allowClear style={{ width: 250 }} onSearch={val => setSearch(val)} />
        <Button block type='dashed' icon={<PlusOutlined />} onClick={handleAdd}>New</Button>
      </div>
      <List size='small' dataSource={data} loading={data.length === 0}
        renderItem={entry => (
          <Item actions={[
            <Button onClick={() => handleEdit(entry._id)}>Edit</Button>,
            <Popconfirm title="Yakin di hapus?" placement="left"
              onCancel={e => e?.stopPropagation()}
              onConfirm={e => {
                e?.stopPropagation();
                handleDelete(entry._id);
              }}>
              <Button onClick={e => e.stopPropagation()}>Delete</Button>
            </Popconfirm>
          ]}>
            {Object.entries(entry).map(([key, value]) => {
              if (key === '_id') return;
              return (
                <div>{value}</div>
              );
            })}
          </Item>
        )} />
      <Modal centered maskClosable width={600} footer={null} /* TODO */ />
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

interface ITemplateProps {
  collectionName: string
}

interface IData {
  _id: BSON.ObjectId
  name: string
  [key: string]: any
}
