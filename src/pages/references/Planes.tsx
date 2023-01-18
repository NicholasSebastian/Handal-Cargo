import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Planes: FC = () => {
  return (
    <ListTemplate 
      collectionName="Planes"
      searchBy="name"
      form={[
        { key: 'name', label: 'Nama Pesawat' }
      ]} />
  );
}

export default Planes;
