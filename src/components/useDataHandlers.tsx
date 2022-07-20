import { FC, ComponentType, useState, useEffect } from 'react';
import { BSON } from 'realm-web';
import { message } from 'antd';
import useDatabase from "../data/useDatabase";

// Abstracts over TableTemplate and ListTemplate to handle data manipulation.

// TODO: Advanced search modes. (partial, full-match, from-beginning)

function useDataHandlers(collectionName: string) {
  const database = useDatabase();
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
  return {
    data, modal, setSearch, setModal,
    handlers: {
      handleAdd, handleEdit, handleDelete
    }
  };
}

export type { IData, DataHandlers };
export default useDataHandlers;

interface IData {
  _id: BSON.ObjectId
  name: string
}

type DataHandlers = ReturnType<typeof useDataHandlers>['handlers'];
type ModalState = null | { mode: 'add' } | { mode: 'view', id: BSON.ObjectId } | { mode: 'edit', id: BSON.ObjectId };
