import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Expeditions: FC = () => {
  return (
    <ListTemplate 
      collectionName="Expeditions"
      searchBy="name"
      form={[
        { key: 'name', label: 'Nama Ekspedisi' }
      ]} />
  );
}

export default Expeditions;
