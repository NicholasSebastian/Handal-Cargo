import { FC, ComponentType, useState, useMemo } from 'react';
import { BSON } from 'realm-web';
import { message } from 'antd';
import useDatabase from "../../data/useDatabase";
import useRoute from '../../data/useRoute';
import { momentsToDates } from '../../utils';
import useDataFetching, { Query } from './useDataFetching';

// Abstracts over TableTemplate and ListTemplate to handle common logic.

function withTemplateHandling<P extends ISharedProps>(Component: ComponentType<P & IInjectedProps>): 
  FC<P & IEnhancedProps> {
  return props => {
    const { collectionName, searchBy, query } = props;
    const { title } = useRoute()!;
    const database = useDatabase();
  
    const { data, loading, searchKey, setSearch, setSearchKey, refreshData } = useDataFetching(collectionName, searchBy, query);
    const [modal, setModal] = useState<ModalState>(null);
  
    const modalTitle = useMemo(() => {
      if (modal?.mode === 'add') return title + ' Baru';
      if (modal?.mode === 'edit') return 'Edit ' + title;
      return title;
    }, [modal]);
    
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

export type { ISharedProps, IData };
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
