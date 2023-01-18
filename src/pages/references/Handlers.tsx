import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Handlers: FC = () => {
  return (
    <ListTemplate 
      collectionName="Handlers"
      searchBy="name"
      form={[
        { key: 'name', label: 'Nama Pengurus' }
      ]} />
  );
}

export default Handlers;
