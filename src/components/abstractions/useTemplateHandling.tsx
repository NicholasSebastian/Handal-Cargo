import { useState, useEffect, useMemo } from 'react';
import { BSON } from 'realm-web';
import { message } from 'antd';
import useDatabase from "../../data/useDatabase";
import useRoute from '../../data/useRoute';
import { momentsToDates } from '../../utils';

// Abstracts over TableTemplate and ListTemplate to handle common logic.

// TODO: Convert this into a higher-order component.
// TODO: Add a state for the 'title', and wrap the children in context so it can set the title.

function useTemplateHandling(collectionName: string, defaultSearchBy: string, customQuery ?: Query) {
  const database = useDatabase();
  const { title } = useRoute()!;

  const [data, setData] = useState<Array<IData>>();
  const [search, setSearch] = useState<RegExp>();
  const [searchBy, setSearchBy] = useState(defaultSearchBy);
  const [modal, setModal] = useState<ModalState>(null);
  const [loading, setLoading] = useState(false);

  const modalTitle = useMemo(() => {
    if (modal?.mode === 'add') return title + ' Baru';
    if (modal?.mode === 'edit') return 'Edit ' + title;
    return title;
  }, [modal]);

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
        message.success(`${values.name ?? 'Data'} telah disimpan.`);
        setModal(null);
        refreshData();
      })
      .catch(() => message.error(`Error terjadi. ${values.name} gagal disimpan.`));
  };

  const handleEdit = (entryId: BSON.ObjectId, values: any) => {
    database?.collection(collectionName)
      .updateOne({ _id: entryId }, { $set: momentsToDates(values) })
      .then(() => {
        message.success(`${values.name ?? 'Data'} telah diubah.`);
        setModal(null);
        refreshData();
      })
      .catch(() => message.error(`Error terjadi. ${values.name} gagal diubah.`));
  };

  const handleDelete = (entryId: BSON.ObjectId) => {
    database?.collection(collectionName)
      .deleteOne({ _id: entryId })
      .then(() => {
        message.success("Data telah dihapus.");
        refreshData();
      })
      .catch(() => message.error("Error terjadi. Data gagal dihapus."));
  };

  useEffect(refreshData, [search]);
  return {
    data, 
    loading,
    modalTitle,
    searchBy,
    modal, 
    setSearch, 
    setSearchBy,
    setModal, 
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
