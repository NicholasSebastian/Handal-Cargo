import { useState, useEffect } from 'react';
import { BSON } from 'realm-web';
import { message } from 'antd';
import useDatabase from "../../data/useDatabase";
import useRoute from '../../data/useRoute';
import { momentsToDates } from '../../utils';

// Abstracts over TableTemplate and ListTemplate to handle common logic.

function useTemplateHandling(collectionName: string, defaultSearchBy: string, customQuery ?: Query) {
  const database = useDatabase();
  const { title } = useRoute()!;

  const [data, setData] = useState<Array<IData>>();
  const [search, setSearch] = useState<RegExp>();
  const [searchBy, setSearchBy] = useState(defaultSearchBy);
  const [modal, setModal] = useState<ModalState>(null);
  const [loading, setLoading] = useState(false);

  const query = () => {
    if (customQuery) 
      return customQuery(collectionName, search, searchBy);
    if (!search) 
      return database?.collection(collectionName).find();
    else 
      return database?.collection(collectionName).find({ 
        [searchBy]: { $regex: search, $options: 'i' } 
      });
  } 

  const refreshData = () => {
    setLoading(true);
    query()
      ?.then(results => {
        if (results) setData(results);
      })
      .finally(() => setLoading(false));
  };
  
  const handleAdd = (values: any) => {
    database?.collection(collectionName)
      .insertOne(momentsToDates(values))
      .then(() => {
        message.success(`${values.name ? values.name : 'Data'} telah disimpan.`);
        setModal(null);
        refreshData();
      });
  };

  const handleEdit = (entryId: BSON.ObjectId, values: any) => {
    database?.collection(collectionName)
      .updateOne({ _id: entryId }, { $set: momentsToDates(values) })
      .then(() => {
        message.success(`${values.name ? values.name : 'Data'} telah diubah.`);
        setModal(null);
        refreshData();
      });
  };

  const handleDelete = (entryId: BSON.ObjectId) => {
    database?.collection(collectionName)
      .deleteOne({ _id: entryId })
      .then(() => {
        message.success("Data telah dihapus.");
        refreshData();
      });
  };

  const getFormTitle = () => {
    if (modal?.mode === 'add') return title + ' Baru';
    if (modal?.mode === 'edit') return 'Edit ' + title;
    return title;
  }

  useEffect(refreshData, [search]);
  return {
    data, 
    loading,
    searchBy,
    modal, 
    setSearch, 
    setSearchBy,
    setModal, 
    getFormTitle,
    handlers: {
      handleAdd, 
      handleEdit, 
      handleDelete
    }
  };
}

export type { IData, Query };
export default useTemplateHandling;

interface IData {
  _id: BSON.ObjectId
  name: string
  [key: string]: any
}

type ModalState = null 
  | { mode: 'add' } 
  | { mode: 'view', id: BSON.ObjectId } 
  | { mode: 'edit', id: BSON.ObjectId };

type Query = (collectionName: string, search: RegExp | undefined, searchBy: string) => Promise<any> | undefined
