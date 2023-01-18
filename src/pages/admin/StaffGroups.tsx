import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const StaffGroups: FC = () => {
  return (
    <ListTemplate 
      collectionName="StaffGroups"
      searchBy="name"
      form={[
        { key: 'name', label: 'Nama Grup' }
      ]} />
  );
}

export default StaffGroups;
