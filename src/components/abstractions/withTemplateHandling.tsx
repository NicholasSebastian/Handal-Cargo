import { FC, ComponentType, useState, useEffect, useMemo, useCallback } from 'react';
import { BSON } from 'realm-web';
import { message } from 'antd';
import useDatabase from "../../data/useDatabase";
import useRoute from '../../data/useRoute';
import { momentsToDates } from '../../utils';

// Abstracts over TableTemplate and ListTemplate to handle common logic.

function withTemplateHandling<P extends ISharedProps>(Component: ComponentType<P & IInjectedProps>): 
  FC<P & IEnhancedProps> {
  return props => {
    const { collectionName, searchBy, query } = props;
    const database = useDatabase();
    const { title } = useRoute()!;
  
    const [data, setData] = useState<Array<IData>>();
    const [search, setSearch] = useState<RegExp>();
    const [searchKey, setSearchKey] = useState(searchBy);
    const [modal, setModal] = useState<ModalState>(null);
    const [loading, setLoading] = useState(false);
  
    const modalTitle = useMemo(() => {
      if (modal?.mode === 'add') return title + ' Baru';
      if (modal?.mode === 'edit') return 'Edit ' + title;
      return title;
    }, [modal]);
  
    const fetchData = useCallback(() => {
      if (query) 
        return query(collectionName, search, searchKey);
      if (!search) 
        return database?.collection(collectionName).find();
      else 
        return database?.collection(collectionName).find({ 
          [searchKey]: { $regex: search, $options: 'i' } 
        });
    }, [collectionName, search, searchKey]);
  
    const refreshData = useCallback(() => {
      setLoading(true);
      fetchData()
        ?.then(results => {
          if (results) setData(results);
        })
        .finally(() => setLoading(false));
    }, []);
    
    const handleAdd = useCallback((values: any) => {
      database?.collection(collectionName)
        .insertOne(momentsToDates(values))
        .then(() => {
          message.success(`${values.name ?? 'Data'} telah disimpan.`);
          setModal(null);
          refreshData();
        })
        .catch(() => message.error(`Error terjadi. ${values.name} gagal disimpan.`));
    }, [collectionName]);
  
    const handleEdit = useCallback((entryId: BSON.ObjectId, values: any) => {
      database?.collection(collectionName)
        .updateOne({ _id: entryId }, { $set: momentsToDates(values) })
        .then(() => {
          message.success(`${values.name ?? 'Data'} telah diubah.`);
          setModal(null);
          refreshData();
        })
        .catch(() => message.error(`Error terjadi. ${values.name} gagal diubah.`));
    }, [collectionName]);
  
    const handleDelete = useCallback((entryId: BSON.ObjectId) => {
      database?.collection(collectionName)
        .deleteOne({ _id: entryId })
        .then(() => {
          message.success("Data telah dihapus.");
          refreshData();
        })
        .catch(() => message.error("Error terjadi. Data gagal dihapus."));
    }, [collectionName]);
  
    useEffect(refreshData, [search]);

    const newProps: IInjectedProps = {
      data, 
      loading,
      modalTitle,
      searchKey,
      modal, 
      setSearch, 
      setSearchKey,
      setModal, 
      handlers: {
        handleAdd, 
        handleEdit, 
        handleDelete
      }
    };

    return <Component {...props} {...newProps} />
  }
}

export type { ISharedProps, IData, ModalState };
export default withTemplateHandling;

interface ISharedProps {
  collectionName: string
}

interface IEnhancedProps {
  searchBy: string
  query?: Query
}

interface IInjectedProps {
  data: IData[] | undefined;
  loading: boolean;
  modalTitle: string;
  searchKey: string;
  modal: ModalState;
  setSearch: React.Dispatch<React.SetStateAction<RegExp | undefined>>;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  handlers: {
    handleAdd: (values: any) => void;
    handleEdit: (entryId: BSON.ObjectId, values: any) => void;
    handleDelete: (entryId: BSON.ObjectId) => void;
  };
}

interface IData {
  _id: BSON.ObjectId
  name: string
  [key: string]: any
}

type ModalState = null 
  | { mode: 'add' } 
  | { mode: 'view', id: BSON.ObjectId } 
  | { mode: 'edit', id: BSON.ObjectId };

type Query = (collectionName: string, search: RegExp | undefined, searchBy: string) => Promise<any> | undefined;
type TitleControl = React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
