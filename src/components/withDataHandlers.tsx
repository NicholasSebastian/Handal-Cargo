import { FC, ComponentType, useState, useEffect } from 'react';
import { BSON } from 'realm-web';
import { message } from 'antd';
import useDatabase from "../data/useDatabase";
import { Subtract } from '../utils';

// Abstracts over TableTemplate and ListTemplate to handle data manipulation.

// TODO: Advanced search modes. (partial, full-match, from-beginning)

function withDataHandlers<P extends IInjectedProps>(Component: ComponentType<P>): 
  FC<ISharedProps & Subtract<P, IInjectedProps>> {
  return props => {
    const { collectionName } = props;
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
    return (
      <Component 
        {...props as P & ISharedProps}
        data={data}
        modal={modal}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setSearch={setSearch}
        setModal={setModal} />
    );
  }
}

export type { IHandledProps, IData };
export default withDataHandlers;

interface ISharedProps {
  collectionName: string
}

interface IInjectedProps {
  data: IData[] | undefined
  modal: ModalState
  handleAdd: (values: any) => void
  handleEdit: (entryId: BSON.ObjectId, values: any) => void
  handleDelete: (entryId: BSON.ObjectId) => void
  setSearch: React.Dispatch<React.SetStateAction<string>>
  setModal: React.Dispatch<React.SetStateAction<ModalState>>
}

interface IData {
  _id: BSON.ObjectId
  name: string
}

type IHandledProps = ISharedProps & IInjectedProps;
type ModalState = null | { mode: 'add' } | { mode: 'view', id: BSON.ObjectId } | { mode: 'edit', id: BSON.ObjectId };
