import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const ContainerGroups: FC = () => {
  return (
    <ListTemplate 
      collectionName="ContainerGroups"
      searchBy="name"
      form={[
        { key: 'name', label: 'Nama Kelompok' }
      ]} />
  );
}

export default ContainerGroups;
