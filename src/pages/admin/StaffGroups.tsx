import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const StaffGroups: FC = () => {
  return (
    <ListTemplate 
      collectionName="StaffGroups"
      form={{ nameLabel: "Nama Grup" }} />
  );
}

export default StaffGroups;
